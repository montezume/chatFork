<?php
$mysqli = new mysqli("localhost:3306", "root", "");

/* check connection */
if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();
}

/* check if server is alive */
if ($mysqli->ping()) {
    printf ("Our connection is ok!\n");
} else {
    printf ("Error: %s\n", $mysqli->error);
}

$create_table = 
"
CREATE DATABASE IF NOT EXISTS CHAT;
USE CHAT;

DROP TABLE IF EXISTS MESSAGE;
DROP TABLE IF EXISTS USER;
CREATE TABLE USER 
 (
 USER_ID INT(11) PRIMARY KEY auto_increment,
 USERNAME VARCHAR(50) NOT NULL,
 EMAIL	  VARCHAR(255)NOT NULL DEFAULT '',
 PASSWORD VARCHAR(255) NOT NULL,
 LAST_ACTIVE TIMESTAMP DEFAULT NOW()

 );
 
CREATE TABLE MESSAGE 
( 
 MESSAGE_ID INT(11) PRIMARY KEY auto_increment,
 CONTENT VARCHAR(255) NOT NULL DEFAULT '',
 USER_ID INT(11),
 DATE_CREATED TIMESTAMP DEFAULT NOW(),
 FOREIGN KEY (USER_ID)
	REFERENCES user(user_id)
	ON DELETE CASCADE
 );";

$create_tbl = $mysqli->multi_query($create_table);

if ($create_tbl) {
	echo "Table has created";
}
else {
	echo $mysqli->error;
        echo "error!!";  
}

$mysqli->close();
?>
