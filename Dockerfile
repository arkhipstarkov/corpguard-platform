# build stage
FROM golang:1.25.4-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /highload-api ./cmd/api

# runtime
FROM alpine:3.18
RUN apk add --no-cache ca-certificates
COPY --from=builder /highload-api /usr/local/bin/highload-api
EXPOSE 8080
CMD ["/usr/local/bin/highload-api"]
