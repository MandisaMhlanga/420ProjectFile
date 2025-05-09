<?php
session_start();
require 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $product_id = $_POST['product_id'];

    // Fetch the product details from database
    $stmt = $pdo->prepare("SELECT * FROM Products WHERE id = ?");
    $stmt->execute([$product_id]);
    $product = $stmt->fetch();

    if ($product) {
        $_SESSION['cart'][$product_id] = [
            'productName' => $product['productName'],
            'price' => $product['price'],
            'quantity' => ($_SESSION['cart'][$product_id]['quantity'] ?? 0) + 1
        ];
    }

    header("Location: ../cart.php");
    exit();
}
?>
