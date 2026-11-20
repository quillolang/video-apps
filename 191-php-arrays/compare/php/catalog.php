<?php
$lamps = [101 => 'Desk lamp', 102 => 'Floor lamp'];
$chairs = [205 => 'Stool', 206 => 'Armchair'];
$catalog = array_merge($lamps, $chairs);
?>
<!doctype html>
<title>Catalog</title>
<link rel="stylesheet" href="quirks.css">
<main>
  <h1>Catalog</h1>
  <ul class="plain">
    <?php foreach ($catalog as $id => $name): ?>
      <li>#<?= $id ?> <?= htmlspecialchars($name) ?></li>
    <?php endforeach ?>
  </ul>
</main>
