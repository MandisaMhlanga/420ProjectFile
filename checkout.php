<?php
session_start();
require 'config.php';

if (!isset($_SESSION['user_id'])) {
    echo "You must be logged in to checkout.";
    exit();
}

$cart = $_SESSION['cart'] ?? [];

if (empty($cart)) {
    echo "Your cart is empty.";
    exit();
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("INSERT INTO orders (user_id, total_price) VALUES (?, ?)");
    $total_price = 0;
    foreach ($cart as $item) {
        $total_price += $item['price'] * $item['quantity'];
    }
    $stmt->execute([$_SESSION['user_id'], $total_price]);
    $order_id = $pdo->lastInsertId();

    $stmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)");
    foreach ($cart as $product_id => $item) {
        $stmt->execute([$order_id, $product_id, $item['quantity']]);
    }

    $pdo->commit();

    unset($_SESSION['cart']);

    echo "<h2>Thank you for your order!</h2>";
    echo "<p>Your order number is #" . htmlspecialchars($order_id) . ".</p>";
    echo "<a href='products.html' class='btn'>Continue Shopping</a>";

} catch (Exception $e) {
    $pdo->rollBack();
    echo "Something went wrong: " . $e->getMessage();
}
?>
