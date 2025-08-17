<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$username = $_POST['username'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($username) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all fields']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters long']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address']);
    exit;
}

$db = getDbConnection();

$stmt = $db->prepare('SELECT id FROM users WHERE username = :username OR email = :email');
$stmt->bindValue(':username', $username, SQLITE3_TEXT);
$stmt->bindValue(':email', $email, SQLITE3_TEXT);

$result = $stmt->execute();
$existingUser = $result->fetchArray(SQLITE3_ASSOC);

if ($existingUser) {
    echo json_encode(['success' => false, 'message' => 'Username or email already exists']);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$registrationDate = time();

$stmt = $db->prepare('
    INSERT INTO users (username, email, password, registration_date, last_login)
    VALUES (:username, :email, :password, :registration_date, :last_login)
');

$stmt->bindValue(':username', $username, SQLITE3_TEXT);
$stmt->bindValue(':email', $email, SQLITE3_TEXT);
$stmt->bindValue(':password', $hashedPassword, SQLITE3_TEXT);
$stmt->bindValue(':registration_date', $registrationDate, SQLITE3_INTEGER);
$stmt->bindValue(':last_login', $registrationDate, SQLITE3_INTEGER);

$stmt->execute();
$userId = $db->lastInsertRowID();

$token = createAuthToken($userId);

$db->close();

echo json_encode([
    'success' => true,
    'userId' => $userId,
    'username' => $username,
    'token' => $token
]); 