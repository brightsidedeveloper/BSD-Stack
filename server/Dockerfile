# Build stage
FROM golang:1.23 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o server main.go

FROM debian:bookworm-slim

WORKDIR /root/

COPY --from=builder /app/server .
COPY --from=builder /app/.env .env

COPY ../web/dist ./dist

EXPOSE 8080

CMD ["./server"]