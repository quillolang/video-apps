<?php
$invited = ['Ana', 'Ben', 'Cy'];
$name = $_GET['name'] ?? 'Ana';
$found = array_search($name, $invited);
?>
<!doctype html>
<title>Invited?</title>
<link rel="stylesheet" href="quirks.css">
<main>
  <h1>Invited?</h1>
  <p class="result">
    <?= htmlspecialchars($name) ?> <?= $found ? 'is invited' : 'is not on the list' ?>
  </p>
</main>
