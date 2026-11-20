<?php
$sent = $_SERVER['REQUEST_METHOD'] === 'POST';
$kids = $_POST['kids'] ?? '';
?>
<!doctype html>
<title>Booking</title>
<link rel="stylesheet" href="quirks.css">
<main>
  <h1>Booking</h1>
  <form method="post">
    <label>Kids <input name="kids" type="number" min="0"></label>
    <button>Book</button>
  </form>
  <?php if ($sent): ?>
    <p class="result">
      <?= empty($kids) ? 'How many kids?' : 'Booked, with ' . htmlspecialchars($kids) . ' kids' ?>
    </p>
  <?php endif ?>
</main>
