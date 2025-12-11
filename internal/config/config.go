package config

import (
	"os"
)

type Config struct {
	DB struct {
		DSN string
	}
}

func Load() (*Config, error) {
	cfg := &Config{}

	dsn := os.Getenv("POSTGRES_URL")
	if dsn == "" {
		// fallback на дефолт, если env не найден
		dsn = "postgres://hs_user:hs_pass@localhost:5433/hs_db?sslmode=disable"
	}

	cfg.DB.DSN = dsn
	return cfg, nil
}
