<?php
header('Content-Type: application/json');
$cart = ['pencil' => 0.10, 'eraser' => 0.20];
echo json_encode(['total' => array_sum($cart)]), "\n";
