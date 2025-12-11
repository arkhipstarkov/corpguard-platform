-- name: CreateViolation :one
INSERT INTO violations (user_id, description)
VALUES ($1, $2)
RETURNING id, user_id, description, created_at;

-- name: ListViolations :many
SELECT id, user_id, description, created_at
FROM violations
ORDER BY created_at DESC;
