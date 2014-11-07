 <?php 
session_start();

require 'UserDAO.php';
require 'MessageDAO.php';

$userDAO    = new UserDAO();
$messageDAO = new MessageDAO();

$requestType = htmlentities($_POST['request_type']);

switch ($requestType) {
    
    /* Returns users active in the last five minutes.
     */
    case 'getOnlineUsers':
        
        // User must be signed in to use this function.
		if (isset($_SESSION['user']) && $_SESSION['user'] != '') {
            echo $userDAO->getActiveUsers();
        } else {
            // User is not authenticated.
            return -1;
        }
        break;
    
    // Logs out.
    case 'logout':
		// destroy the session.
		
		// Unset all of the session variables.
		$_SESSION = array();
		session_destroy();
        break;
    
    /* Accepts a user id, message content, and adds the message to the db.
     */
    case 'sendMessage':
        // User must be authenticated
		if (isset($_SESSION['user']) && $_SESSION['user'] != '') {
            $userId  = htmlentities($_REQUEST['user_Id']);
            $content = htmlentities($_REQUEST['content']);
            $messageDAO->createMessage($userId, $content);
            $userDAO->updateLastActive($userId);
            echo true;
			break;
        } else {
            echo -1;
			break;
        }
    case 'retrieveUserId':
		// User must be authenticated
		if (isset($_SESSION['user']) && $_SESSION['user'] != '') {
            $username = $_SESSION['user'];
            echo $userDAO->getUserId($username);
        } else {
			// User is not authenticated.
            echo -1;
        }
        break;
    
    /* 
     * Retrieves last five minutes worth of messages, or last message if none.
     */
    case 'retrieveLastFive':
        
        // User needs to be authenticated to use this function.
		if (isset($_SESSION['user']) && $_SESSION['user'] != '') {
            echo ($messageDAO->retrieveLastFiveMins());
			break;
        }
        
        else {
            echo -1;
			break;
        }    
    
    case 'retrieve':
        // User needs to be logged in to use this function.
        
		if (isset($_SESSION['user']) && $_SESSION['user'] != '') {
		    $lastId = $_REQUEST['last_Id'];
            echo ($messageDAO->retrieve($lastId));
		}
		else {
            echo -1;
        }
        break;
    
    // Check to ensure username isn't taken.    
    case 'checkUser':
        $username = htmlentities($_REQUEST['name']);
        echo ($userDAO->validateUsername($username)) ? 1 : -1;
        break;
    // Check to ensure password passes business rules.
    case 'checkPass':
        $password = htmlentities($_REQUEST['name']);
        echo ($userDAO->validatePassword($password)) ? 1 : -1;
        break;
    
    case 'login':
        $username = htmlentities($_REQUEST['name']);
        $password = htmlentities($_REQUEST['password']);
        
        // if successful login, set session and return username
        
        if ($userDAO->login($username, $password)) {
			// regen id.
			session_regenerate_id(true);
            $_SESSION['user'] = $username;
			// update last active.
			$userId = $userDAO->getUserId($username);
			$userDAO->updateLastActive($userId);
            echo $_SESSION['user'];
			
        } else {
            echo -1;
        }
        break;
    
    case 'register':
        
        $username = htmlentities($_REQUEST['name']);
        $password = htmlentities($_REQUEST['password']);
        $email    = htmlentities($_REQUEST['email']);
        
        // session id stuff - > create session
        
        if ($userDAO->createUser($username, $password, $email)) {
            session_regenerate_id(true);
			$_SESSION['user'] = $username;
			// update last active.
			$userId = $userDAO->getUserId($username);
			$userDAO->updateLastActive($userId);

            echo $_SESSION['user'];
        }
        
        else {
            // there was a problem creating account.
            echo -1;
        }
        
        break;
}

?> 