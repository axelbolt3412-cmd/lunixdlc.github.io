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
    echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
    exit;
}

if (!validateToken($userId, $token)) {
    echo json_encode(['success' => false, 'message' => 'Invalid token']);
    exit;
}

$user = getUserById($userId);

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'User not found']);
    exit;
}

echo json_encode([
    'success' => true,
    'email' => $user['email'],
    'registrationDate' => $user['registration_date'],
    'lastLogin' => $user['last_login']
]); 