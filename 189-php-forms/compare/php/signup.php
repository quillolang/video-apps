<?php
$sent = $_SERVER['REQUEST_METHOD'] === 'POST';
$email = $_POST['user.email'] ?? '';
?>
<!doctype html>
<title>Newsletter</title>
<link rel="stylesheet" href="quirks.css">
<main>
  <h1>Newsletter</h1>
  <form method="post">
    <input name="user.email" placeholder="Your email">
    <button>Sign up</button>
  </form>
  <?php if ($sent): ?>
    <p class="result">
      <?= $email === '' ? 'Please enter your email' : 'Thanks, ' . htmlspecialchars($email) ?>
    </p>
  <?php endif ?>
</main>
