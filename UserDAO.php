<?php

class UserDAO {

	private $pdo;
	
	function __construct() {
		//try to connect to the database
		try {
			$this->pdo = new PDO('mysql:host=localhost;dbname=chat', 'root', '');
			$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			}

		catch (PDOException $e) {
			echo $e;
			}
		}
	
	function login($username, $password) {
		$hashPass = hash('sha512', $password);

		$query = "SELECT password FROM USER WHERE username = ?";
		$stmt = $this->pdo->prepare($query);
		$stmt->bindParam(1, $username);
		$stmt->execute();
		$returnedPassword = $stmt->fetchColumn(0);

		return ($returnedPassword === $hashPass);
		
	}
	
	function createUser($username, $password, $email) {
		
		// Validation
		if (!($this->validateUsername($username)) || !($this->validatePassword($password))) {
			return false;
		}
		
		// Hash password.
		
		$hashPass = hash('sha512', $password);
		
		$query = "INSERT into USER (username, password, email) VALUES (?, ?, ?);";
		$stmt = $this->pdo->prepare($query);
		$stmt->bindParam(1, $username);
		$stmt->bindParam(2, $hashPass);
		$stmt->bindParam(3, $email);
		return $stmt->execute();

	}
	
	function validateUsername($username) {
	
		if ($username == "") {
			return false;
		}
		// check it's not empty string.
		
		// Check to insure that username is not already in DB.
			
		$query = "select * from USER where USERNAME = ?;";
		$stmt = $this->pdo->prepare($query);
		$stmt->bindParam(1, $username);
		$stmt->execute();
		$rows = $stmt->rowCount();	
		return $rows > 0 ? false : true;
	}
	
	function validatePassword($password) {
		// Check to insure that password follows business rules.
		
		$pattern = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,8}$^";
		
		return preg_match($pattern, $password);

	}
}
?>