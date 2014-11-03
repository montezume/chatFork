<?php 

require 'UserDAO.php';
require 'MessageDAO.php';

// start the session
session_start();

$userDAO = new UserDAO();
$messageDAO = new MessageDAO();

$requestType = htmlentities($_POST['request_type']);

switch ($requestType) {

	case 'retrieve' :
		// fix this
		
		$lastId = $_REQUEST['last_Id'];
		echo (json_encode($messageDAO->retrieve($lastId), JSON_FORCE_OBJECT));
		break;

	case 'checkUser' :
		$username = htmlentities($_REQUEST['name']);
		echo ($userDAO->validateUsername($username)) ? 1 : -1;
		break;
	case 'checkPass' :
		$password = htmlentities($_REQUEST['name']);
		echo ($userDAO->validatePassword($password)) ? 1 : -1;
		break;
	case 'login' :
	
		$username = htmlentities($_REQUEST['name']);
		$password = htmlentities($_REQUEST['password']);
		
		// if successful login, set session and return username
		
		if ($userDAO->login($username, $password)) {
			$_SESSION['user'] = $username;
			echo $_SESSION['user'];
		}
		else {
			echo false;
		}
		
		break;
	case 'register' :
			
		$username = htmlentities($_REQUEST['name']);
		$password = htmlentities($_REQUEST['password']);
		$email = htmlentities($_REQUEST['email']);
		
		// session id stuff - > create session
		
		echo var_dump($userDAO->createUser($username,$password, $email));
		/*
		if($userDAO->createUser($username, $password, $email)) {
			$_SESSION['user'] = $username;
			echo $_SESSION['user'];
		}
		
		else {
			// there was a problem creating account.
			echo false;
		}
		*/
		
		break;
}




?>