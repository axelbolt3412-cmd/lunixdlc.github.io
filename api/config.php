<?php
$dbPath = __DIR__ . '/../database/client_db.sqlite';
$secretKey = 'excellent_client_secret_key';

function getDbConnection() {
    global $dbPath;
    
    try {
        $db = new SQLite3($dbPath);
        $db->enableExceptions(true);
        
        return $db;
    } catch (Exception $e) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Failed to connect to database']);
        exit;
    }
}

function initializeDatabase() {
    global $dbPath;
    
    if (!file_exists(dirname($dbPath))) {
        mkdir(dirname($dbPath), 0755, true);
    }
    
    $db = getDbConnection();
    
    $db->exec('
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            registration_date INTEGER NOT NULL,
            last_login INTEGER
        )
    ');
    
    $db->exec('
        CREATE TABLE IF NOT EXISTS auth_tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            expires_at INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    ');
    
    $db->close();
}

function generateToken() {
    return bin2hex(random_bytes(32));
}

function validateToken($userId, $token) {
    $db = getDbConnection();
    
    $stmt = $db->prepare('
        SELECT * FROM auth_tokens 
        WHERE user_id = :user_id AND token = :token AND expires_at > :now
    ');
    
    $stmt->bindValue(':user_id', $userId, SQLITE3_INTEGER);
    $stmt->bindValue(':token', $token, SQLITE3_TEXT);
    $stmt->bindValue(':now', time(), SQLITE3_INTEGER);
    
    $result = $stmt->execute();
    $tokenData = $result->fetchArray(SQLITE3_ASSOC);
    
    $db->close();
    
    return $tokenData !== false;
}

function getUserById($userId) {
    $db = getDbConnection();
    
    $stmt = $db->prepare('SELECT * FROM users WHERE id = :id');
    $stmt->bindValue(':id', $userId, SQLITE3_INTEGER);
    
    $result = $stmt->execute();
    $user = $result->fetchArray(SQLITE3_ASSOC);
    
    $db->close();
    
    return $user;
}

function createAuthToken($userId) {
    $db = getDbConnection();
    
    $token = generateToken();
    $createdAt = time();
    $expiresAt = $createdAt + (30 * 24 * 60 * 60);
    
    $stmt = $db->prepare('
        INSERT INTO auth_tokens (user_id, token, created_at, expires_at)
        VALUES (:user_id, :token, :created_at, :expires_at)
    ');
    
    $stmt->bindValue(':user_id', $userId, SQLITE3_INTEGER);
    $stmt->bindValue(':token', $token, SQLITE3_TEXT);
    $stmt->bindValue(':created_at', $createdAt, SQLITE3_INTEGER);
    $stmt->bindValue(':expires_at', $expiresAt, SQLITE3_INTEGER);
    
    $stmt->execute();
    
    $db->close();
    
    return $token;
}

initializeDatabase(); 