-- name: CreateUser :one
INSERT INTO users (email, password_hash, full_name, role)
VALUES ($1, $2, $3, $4)
RETURNING id, email, full_name, role, created_at;

-- name: GetUserByID :one
SELECT id, email, full_name, role, created_at
FROM users
WHERE id = $1;

-- name: GetUserByEmail :one
SELECT id, email, full_name, role, password_hash, created_at
FROM users
WHERE email = $1;

-- name: ListUsers :many
SELECT id, email, full_name, role, created_at
FROM users
ORDER BY id;

-- name: UpdateUser :one
UPDATE users
SET email = $2, full_name = $3, role = $4
WHERE id = $1
RETURNING id, email, full_name, role, created_at;

-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1;
