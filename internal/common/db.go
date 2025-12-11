package common

import (
	"context"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func InitDB() error {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		// локальные значения по умолчанию
		dsn = "postgres://hs_user:hs_pass@127.0.0.1:5433/hs_db?sslmode=disable"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	config, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return err
	}

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		return err
	}

	DB = pool
	// проверить соединение
	return DB.Ping(ctx)
}
