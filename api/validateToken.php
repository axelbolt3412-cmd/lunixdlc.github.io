<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$userId = $_GET['userId'] ?? '';
$token = $_GET['token'] ?? '';

if (empty($userId) || empty($token)) {
    echo json_encode(['success' => false, 'message' => 'Missing required parameters', 'valid' => false]);
    exit;
}

$isValid = validateToken($userId, $token);

echo json_encode([
    'success' => true,
    'valid' => $isValid
]); 