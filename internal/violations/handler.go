package violations

import (
	"net/http"

	"github.com/ClickHouse/clickhouse-go/v2"
	"github.com/arkhipstarkov/corpguard-platform/internal/ch"
	"github.com/arkhipstarkov/corpguard-platform/internal/db"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
)

// Handler содержит ClickHouse клиент
type Handler struct {
	Queries    *db.Queries
	Clickhouse clickhouse.Conn // <- теперь Conn напрямую
}

// Конструктор
func NewHandler(q *db.Queries, chClient clickhouse.Conn) *Handler {
	return &Handler{
		Queries:    q,
		Clickhouse: chClient,
	}
}

// Структура запроса на создание нарушения
type CreateViolationReq struct {
	Description string `json:"description" binding:"required"`
}

// ViolationResponse —  только для Swagger документации
type ViolationResponse struct {
	ID          int32  `json:"id"`
	UserID      int32  `json:"user_id"`
	Description string `json:"description"`
}

// Создание нарушения
// CreateViolation godoc
// @Summary Create a violation
// @Description Create a new violation for a user
// @Tags violations
// @Accept json
// @Produce json
// @Param request body CreateViolationReq true "Violation data"
// @Success 201 {object} violations.ViolationResponse
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Security BearerAuth
// @Router /violations [post]
func (h *Handler) CreateViolation(c *gin.Context) {
	userID := c.GetInt("user_id")

	var req CreateViolationReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// pgtype.Int4 для sqlc + pgx
	pgUserID := pgtype.Int4{
		Int32: int32(userID),
		Valid: true,
	}

	v, err := h.Queries.CreateViolation(c, db.CreateViolationParams{
		UserID:      pgUserID,
		Description: req.Description,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Запись события в ClickHouse
	_ = ch.InsertEvent(h.Clickhouse, ch.Event{
		UserID:   int32(userID),
		Action:   "create_violation",
		Entity:   "violation",
		EntityID: v.ID,
	})

	// Возвращаем DTO для Swagger
	c.JSON(http.StatusCreated, ViolationResponse{
		ID:          v.ID,
		UserID:      int32(userID),
		Description: v.Description,
	})
}

// Получение списка нарушений
// ListViolations godoc
// @Summary List all violations
// @Description Get a list of all violations
// @Tags violations
// @Produce json
// @Success 200 {array} violations.ViolationResponse
// @Failure 500 {object} map[string]string
// @Security BearerAuth
// @Router /violations [get]
func (h *Handler) ListViolations(c *gin.Context) {
	violations, err := h.Queries.ListViolations(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Конвертация db.Violation - ViolationResponse
	resp := make([]ViolationResponse, len(violations))
	for i, v := range violations {
		resp[i] = ViolationResponse{
			ID:          v.ID,
			UserID:      int32(v.UserID.Int32),
			Description: v.Description,
		}
	}

	c.JSON(http.StatusOK, resp)
}
