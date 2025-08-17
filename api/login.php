<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all fields']);
    exit;
}

$db = getDbConnection();

$stmt = $db->prepare('SELECT * FROM users WHERE username = :username');
$stmt->bindValue(':username', $username, SQLITE3_TEXT);

$result = $stmt->execute();
$user = $result->fetchArray(SQLITE3_ASSOC);

if (!$user || !password_verify($password, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    exit;
}

$updateStmt = $db->prepare('UPDATE users SET last_login = :last_login WHERE id = :id');
$updateStmt->bindValue(':last_login', time(), SQLITE3_INTEGER);
$updateStmt->bindValue(':id', $user['id'], SQLITE3_INTEGER);
$updateStmt->execute();

$token = createAuthToken($user['id']);

$db->close();

echo json_encode([
    'success' => true,
    'userId' => $user['id'],
    'username' => $user['username'],
    'token' => $token
]); 