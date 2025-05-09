<?php
session_start();
require 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $selected_role = $_POST['role']; // Get the selected role from form

    // Validate inputs
    if (empty($email) || empty($password) || empty($selected_role)) {
        header("Location: ../login.html?error=empty_fields");
        exit();
    }

    $stmt = $pdo->prepare("SELECT * FROM Users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // Verify the selected role matches the user's actual role
        if ($selected_role !== $user['role']) {
            header("Location: ../login.html?error=role_mismatch");
            exit();
        }
        
        $_SESSION['user'] = $user['userID'];
        $_SESSION['username'] = $user['name'];
        $_SESSION['role'] = $user['role'];
        
        // Redirect based on role
        if ($user['role'] === 'admin') {
            header("Location: ../admin/dashboard.php");
        } else {
            header("Location: ../products.html");
        }
        exit();
    } else {
        header("Location: ../login.html?error=invalid_credentials");
        exit();
    }
}

// If someone tries to access this file directly
header("Location: ../login.html");
exit();
?>