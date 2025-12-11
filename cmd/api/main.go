package main

import (
	"context"
	"log"
	"os"

	"github.com/arkhipstarkov/corpguard-platform/internal/auth"
	"github.com/arkhipstarkov/corpguard-platform/internal/ch"
	"github.com/arkhipstarkov/corpguard-platform/internal/config"
	"github.com/arkhipstarkov/corpguard-platform/internal/db"
	"github.com/arkhipstarkov/corpguard-platform/internal/violations"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func main() {
	ctx := context.Background()

	// Load config
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config load failed: %v", err)
	}

	// Default port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8085"
	}

	// Initialize pgx Connection Pool
	pool, err := pgxpool.New(ctx, cfg.DB.DSN)
	if err != nil {
		log.Fatalf("failed to init pgxpool: %v", err)
	}

	// Check DB connection
	if err := pool.Ping(ctx); err != nil {
		log.Fatalf("database ping failed: %v", err)
	}

	log.Println("database connected")

	// sqlc Queries
	queries := db.New(pool)

	// Initialize ClickHouse connection
	clickhouseConn := ch.NewClickhouse()

	// Gin
	r := gin.Default()

	// Handlers
	authHandler := auth.NewAuthHandler(pool)
	violationsHandler := violations.NewHandler(queries, clickhouseConn)

	// Routes
	api := r.Group("/api")
	{
		// Public routes
		api.POST("/auth/register", authHandler.Register)
		api.POST("/auth/login", authHandler.Login)

		// Protected routes
		authRoutes := api.Group("/")
		authRoutes.Use(auth.JWTMiddleware())
		{
			authRoutes.POST("/violations", violationsHandler.CreateViolation)
			authRoutes.GET("/violations", violationsHandler.ListViolations)
		}
	}

	// Swagger
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Healthcheck
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	//  все маршруты
	for _, route := range r.Routes() {
		log.Println(route.Method, route.Path)
	}

	log.Printf("listening on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
