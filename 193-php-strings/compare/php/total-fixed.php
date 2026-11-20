<?php
header('Content-Type: application/json');
$cart = ['pencil' => 10, 'eraser' => 20];   // in cents
echo json_encode(['total_cents' => array_sum($cart)]), "\n";
