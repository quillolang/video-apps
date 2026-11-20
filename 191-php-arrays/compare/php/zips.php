<?php
header('Content-Type: application/json');
$cities = ['08001' => 'Barcelona', '10001' => 'New York', '75001' => 'Paris'];
echo json_encode(array_keys($cities)), "\n";
