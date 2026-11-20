<?php
$name = $_POST['name'] ?? null;
$ok = $name !== null && strlen($name) <= 10;
?>
<!doctype html>
<meta charset="utf-8">
<title>Username</title>
<link rel="stylesheet" href="quirks.css">
<main>
  <h1>Pick a username</h1>
  <form method="post">
    <input name="name" placeholder="Up to 10 letters">
    <button>Save</button>
  </form>
  <?php if ($name !== null): ?>
    <p class="result">
      <?= $ok ? 'Saved: ' . htmlspecialchars($name) : 'Too long: ' . strlen($name) . ' of 10' ?>
    </p>
  <?php endif ?>
</main>
