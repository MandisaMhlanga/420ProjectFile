<?php
require 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    // Validate inputs
    if (empty($name) || empty($email) || empty($password)) {
        header("Location: ../register.html?error=empty_fields");
        exit();
    }

    if (strlen($password) < 8) {
        header("Location: ../register.html?error=password_length");
        exit();
    }

    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    try {
        $stmt = $pdo->prepare("INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, 'customer')");
        $stmt->execute([$name, $email, $password_hash]);

        // Get the newly created user
        $stmt = $pdo->prepare("SELECT * FROM Users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        // Start session and log user in
        session_start();
        $_SESSION['user'] = $user['userID'];
        $_SESSION['username'] = $user['name'];
        $_SESSION['role'] = $user['role'];

        header("Location: ../products.html?registration=success");
        exit();
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            header("Location: ../register.html?error=email_exists");
            exit();
        } else {
            header("Location: ../register.html?error=server_error");
            exit();
        }
    }
}
?>