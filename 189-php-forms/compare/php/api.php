<?php
header('Content-Type: application/json');
$name = $_POST['name'] ?? 'nobody';
echo json_encode(['greeting' => "Hi, $name!"]), "\n";
