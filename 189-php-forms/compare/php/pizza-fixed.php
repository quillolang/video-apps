<?php
$toppings = $_POST['topping'] ?? null;
?>
<!doctype html>
<title>Pizza</title>
<link rel="stylesheet" href="quirks.css">
<main>
  <h1>Pizza</h1>
  <form method="post">
    <label><input type="checkbox" name="topping[]" value="ham"> Ham</label>
    <label><input type="checkbox" name="topping[]" value="olives"> Olives</label>
    <label><input type="checkbox" name="topping[]" value="basil"> Basil</label>
    <button>Order</button>
  </form>
  <?php if ($toppings !== null): ?>
    <p class="result">Your pizza: <?= htmlspecialchars(implode(', ', $toppings)) ?></p>
  <?php endif ?>
</main>
