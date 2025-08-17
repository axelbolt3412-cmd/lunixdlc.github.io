<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$userId = $_GET['userId'] ?? '';

if (empty($userId)) {
    echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
    exit;
}

$db = getDbConnection();

$stmt = $db->prepare('DELETE FROM auth_tokens WHERE user_id = :user_id');
$stmt->bindValue(':user_id', $userId, SQLITE3_INTEGER);
$stmt->execute();

$db->close();

echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully'
]); 