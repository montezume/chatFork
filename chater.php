<?php 

// start the session
session_start();


require 'UserDAO.php';
require 'MessageDAO.php';

$userDAO = new UserDAO();
$messageDAO = new MessageDAO();

$requestType = $_POST['request_type'];

switch ($requestType) {

	case 'retrieve' :
		//
		$lastId = $_REQUEST['last_Id'];
		echo (json_encode($messageDAO->retrieve($lastId), JSON_FORCE_OBJECT));
		break;

	case 'checkUser' :
		$username = $_REQUEST['name'];
		echo ($userDAO->validateUsername($username)) ? 1 : -1;
		break;
	case 'checkPass' :
		$password = $_REQUEST['name'];
		echo ($userDAO->validatePassword($password)) ? 1 : -1;
		break;
	case 'login' :
		$username = $_REQUEST['name'];
		$password = $_REQUEST['password'];
		// if logged in.
		
		echo ($userDAO->login($username, $password));
		// return session id.
		break;
	case 'register' :
		$username = $_REQUEST['name'];
		$password = $_REQUEST['password'];
		$email = $_REQUEST['email'];
		$userDAO->createUser($username, $password, $email);
		break;
}




?>