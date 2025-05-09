<?php
session_start();
require 'php/db_connect.php';

$cart = $_SESSION['cart'] ?? [];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Fabrix Fashion - Your Cart</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Fabrix Fashion</h1>
    </header>

    <section class="cart">
        <h2>Your Shopping Cart</h2>

        <?php if (empty($cart)): ?>
            <p>Your cart is empty!</p>
        <?php else: ?>
            <table>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                </tr>

                <?php $total = 0; ?>
                <?php foreach ($cart as $id => $item): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($item['name']); ?></td>
                        <td>$<?php echo htmlspecialchars($item['price']); ?></td>
                        <td><?php echo htmlspecialchars($item['quantity']); ?></td>
                    </tr>
                    <?php $total += $item['price'] * $item['quantity']; ?>
                <?php endforeach; ?>
            </table>

            <h3>Total: $<?php echo number_format($total, 2); ?></h3>
            <a href="checkout.php" class="btn">Checkout</a>
        <?php endif; ?>
    </section>

    <footer>
        <p>&copy; 2025 Fabrix Fashion</p>
    </footer>
</body>
</html>
