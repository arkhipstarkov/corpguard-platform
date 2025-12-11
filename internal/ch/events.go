package ch

import (
	"context"

	"github.com/ClickHouse/clickhouse-go/v2"
)

type Event struct {
	UserID   int32
	Action   string
	Entity   string
	EntityID int32
}

func InsertEvent(conn clickhouse.Conn, e Event) error {
	ctx := context.Background()

	return conn.Exec(ctx,
		"INSERT INTO events (user_id, action, entity, entity_id) VALUES (?, ?, ?, ?)",
		e.UserID, e.Action, e.Entity, e.EntityID,
	)
}
