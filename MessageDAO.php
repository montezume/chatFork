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
		
		function getLastMessageId() {
		
		}
		
		function createMessage($user_id, $content) {
			$query = "insert into MESSAGE (CONTENT, USER_ID) values (?, ?);";
			$stmt = $this->pdo->prepare($query);
			$stmt->bindParam(1, $content);
			$stmt->bindParam(2, $user_id);
			return $stmt->execute();

			}

		function retrieve($lastId) {
	
			$query = "select MESSAGE_ID, CONTENT, USER_ID, CAST((time_to_sec(timediff(NOW(), LAST_ACTIVE)) / 60) AS UNSIGNED) AS DATE_CREATED, USERNAME FROM MESSAGE natural join USER where MESSAGE_ID > ? ;";
			
			$stmt = $this->pdo->prepare($query);
			$stmt->bindParam(1, $lastId);
			$stmt->execute();
			
			$messages = $stmt->fetchAll();
			
			$jsonArray = array();
			
			foreach($messages as $value) {
			
				$jsonArray[] = array(
				'msg_id' => $value['MESSAGE_ID'], 
				'content' => $value['CONTENT'], 
				'user_id' => $value['USER_ID'],
				'username' => $value['USERNAME'],
				'date' => $value['DATE_CREATED']);
			}
					
			$json = json_encode($jsonArray);
			
			return $json;
		}
		/**
		 * Returns messages from the last five minutes, if no messages,
		 * returns the most recent message.
		 */
		function retrieveLastFiveMins() {
				
			$query = "select MESSAGE_ID, CONTENT, USER_ID, CAST((time_to_sec(timediff(NOW(), LAST_ACTIVE)) / 60) AS UNSIGNED) AS DATE_CREATED, USERNAME FROM MESSAGE natural join USER where DATE_CREATED > DATE_SUB(now(), INTERVAL 5 MINUTE);";
			$stmt = $this->pdo->prepare($query);
			$stmt->execute();
			
			$messages = $stmt->fetchAll();
			
			
			if (count($messages) == 0) {
				// return last message.
				$query = "select MESSAGE_ID, CONTENT, USER_ID, DATE_FORMAT(DATE_CREATED, '%h:%i:%s %p') AS DATE_CREATED, USERNAME FROM MESSAGE natural join USER order by message_id desc limit 1;";
				$stmt = $this->pdo->prepare($query);
				$stmt->execute();
				$messages = $stmt->fetchAll();
			}
			
			$jsonArray = array();
			
			foreach($messages as $value) {
			
				$jsonArray[] = array(
				'msg_id' => $value['MESSAGE_ID'], 
				'content' => $value['CONTENT'], 
				'user_id' => $value['USER_ID'],
				'username' => $value['USERNAME'],
				'date' => $value['DATE_CREATED']);
			}

			$json = json_encode($jsonArray);
			return $json;

		}
		
		


}

?>