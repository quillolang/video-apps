<?php
header('Content-Type: application/json');
$scores = [3, 0, 5, 0, 8];
$played = array_filter($scores, fn($s) => $s > 0);
echo json_encode(array_values($played)), "\n";
