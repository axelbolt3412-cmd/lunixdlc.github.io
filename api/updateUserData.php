<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$userId = $_POST['userId'] ?? '';
$token = $_POST['token'] ?? '';
$email = $_POST['email'] ?? '';

if (empty($userId) || empty($token)) {
    echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
    exit;
}

if (!validateToken($userId, $token)) {
    echo json_encode(['success' => false, 'message' => 'Invalid token']);
    exit;
}

if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email cannot be empty']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address']);
    exit;
}

$db = getDbConnection();

$stmt = $db->prepare('SELECT id FROM users WHERE email = :email AND id != :id');
$stmt->bindValue(':email', $email, SQLITE3_TEXT);
$stmt->bindValue(':id', $userId, SQLITE3_INTEGER);

$result = $stmt->execute();
$existingUser = $result->fetchArray(SQLITE3_ASSOC);

if ($existingUser) {
    echo json_encode(['success' => false, 'message' => 'Email already in use by another account']);
    exit;
}

$stmt = $db->prepare('UPDATE users SET email = :email WHERE id = :id');
$stmt->bindValue(':email', $email, SQLITE3_TEXT);
$stmt->bindValue(':id', $userId, SQLITE3_INTEGER);

$stmt->execute();

$db->close();

echo json_encode([
    'success' => true,
    'message' => 'User data updated successfully'
]); 