<?php 
	
	$dbhost = '10.0.19.74';
	$dbuser = 'db_khu05243';
	$dbpass = 'khu05243';
	$dbname = 'khu05243';
	
    //create connection
    $conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
		
	// Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
	mysql_close($conn);
?>
