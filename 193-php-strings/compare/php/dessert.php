<?php
$dish = 'Crème brûlée';
?>
<!doctype html>
<meta charset="utf-8">
<title>Dessert</title>
<link rel="stylesheet" href="quirks.css">
<main>
  <h1>Today's dessert</h1>
  <p class="result"><?= htmlspecialchars(strtoupper($dish)) ?></p>
</main>
