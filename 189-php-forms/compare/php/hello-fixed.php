<?php
$name = $_GET['name'] ?? '';
?>
<!doctype html>
<title>Hello</title>
<link rel="stylesheet" href="quirks.css">
<main>
  <h1>Hello</h1>
  <form>
    <input name="name" placeholder="Your name">
    <button>Say hi</button>
  </form>
  <?php if ($name !== ''): ?>
    <p class="result">Hi, <?= htmlspecialchars($name) ?>!</p>
  <?php endif ?>
</main>
