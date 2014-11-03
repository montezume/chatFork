<?php
class MessageDAO {
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
		
		function createMessage($user_id) {
		
		}

		function retrieve($lastId) {
	
			$query = "select * FROM MESSAGE where MESSAGE_ID > ?;";
			
			$stmt = $this->pdo->prepare($query);
			$stmt->bindParam(1, $lastId);
			$stmt->execute();
			
			$messages = $stmt->fetchAll();
			
			$jsonArray = array();
			
			foreach($messages as $value) {
			
				$jsonArray[] = array('msg_id' => $value['MESSAGE_ID'], 
				'content' => $value['CONTENT'], 
				'user_id' => $value['USER_ID'] );
			}
					
			$json = json_encode($jsonArray);
			
			return $json;
		}

		
		function retrieveMessages($minutes) {
	
			$query = "select * from USER join MESSAGE on USER.USER_ID = 
			MESSAGE.USER_ID where DATE_CREATED > DATE_SUB(now(), INTERVAL ? MINUTE);";
			
			$stmt = $this->pdo->prepare($query);
			$stmt->bindParam(1, $minutes);
			$stmt->execute();
			
			$messages = $stmt->fetchAll(PDO::FETCH_GROUP | PDO::FETCH_ASSOC);
			return array_map('reset', $messages);
		}
		
		


}

?>