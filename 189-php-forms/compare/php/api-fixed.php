<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'] ?? 'nobody';
echo json_encode(['greeting' => "Hi, $name!"]), "\n";
