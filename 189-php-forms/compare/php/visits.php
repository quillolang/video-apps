<?php
// A session, with PHP's own session settings.
session_start();
$_SESSION['visits'] = ($_SESSION['visits'] ?? 0) + 1;
echo "Visits: {$_SESSION['visits']}\n";
