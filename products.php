<?php
require '../config.php';

$stmt = $pdo->query("SELECT * FROM Products");
$products = $stmt->fetchAll();

foreach ($products as $product) {
    echo '<div class="product-card">';
    echo '<img src="' . $product['image_url'] . '" alt="' . htmlspecialchars($product['productName']) . '">';
    echo '<h3>' . htmlspecialchars($product['productName']) . '</h3>';
    echo '<p>$' . htmlspecialchars($product['price']) . '</p>';
    echo '<form action="php/add_to_cart.php" method="POST">';
    echo '<input type="hidden" name="productID" value="' . $product['productID'] . '">';
    echo '<button type="submit" class="btn">Add to Cart</button>';
    echo '</form>';
    echo '</div>';
}
?>
