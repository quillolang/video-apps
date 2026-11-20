<?php
$code = $_POST['code'] ?? null;
?>
<!doctype html>
<meta charset="utf-8">
<title>Door</title>
<link rel="stylesheet" href="quirks.css">
<main>
  <h1>Door code</h1>
  <form method="post">
    <input name="code" placeholder="Code">
    <button>Open</button>
  </form>
  <?php if ($code !== null): ?>
    <p class="result"><?= $code == '1000' ? 'Door open' : 'Wrong code' ?></p>
  <?php endif ?>
</main>
