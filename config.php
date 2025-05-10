<?php
// Database connection settings
$host = '10.0.19.74';    
$db   = 'db_khu05243';
$user = 'khu05243'; // Replace with your actual username
$pass = 'khu05243'; // Replace with your actual password
$charset = 'utf8mb4';


// DSN (Data Source Name)
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

// PDO options
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

// Create connection
try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Log the error (in a real application, you'd want to log this securely)
    error_log("Database connection failed: " . $e->getMessage());
    
    // Display a user-friendly message
    die("We're experiencing technical difficulties. Please try again later.");
}
?>