<?php
$name = $_GET['name'] ?? 'Zoë Smith';
$short = substr($name, 0, 3);
?>
<!doctype html>
<meta charset="utf-8">
<title>Badge</title>
<link rel="stylesheet" href="quirks.css">
<main>
  <h1>Badge</h1>
  <p><?= htmlspecialchars($name) ?></p>
  <p class="big">Hi, <?= htmlspecialchars($short) ?>!</p>
</main>
