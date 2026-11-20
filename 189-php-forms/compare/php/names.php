<?php
// What PHP made of the names a form sent.
header('Content-Type: application/json');
echo json_encode(array_keys($_POST)), "\n";
