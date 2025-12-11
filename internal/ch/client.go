package ch

import (
	"context"
	"time"

	"github.com/ClickHouse/clickhouse-go/v2"
)

// NewClickhouse возвращает Conn напрямую
func NewClickhouse() clickhouse.Conn {
	conn, err := clickhouse.Open(&clickhouse.Options{
		Addr: []string{"localhost:9000"},
		Auth: clickhouse.Auth{
			Database: "default",
			Username: "default",
			Password: "",
		},
		Debug: false,
	})
	if err != nil {
		panic(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := conn.Ping(ctx); err != nil {
		panic(err)
	}

	return conn
}
