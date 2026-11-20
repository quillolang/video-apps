<?php
$guests = ['ana', 'ben', 'cy'];
foreach ($guests as &$guest) {
  $guest = ucfirst($guest);
}
?>
<!doctype html>
<title>Guests</title>
<link rel="stylesheet" href="quirks.css">
<main>
  <h1>Guests</h1>
  <ul>
    <?php foreach ($guests as $guest): ?>
      <li><?= htmlspecialchars($guest) ?></li>
    <?php endforeach ?>
  </ul>
</main>
