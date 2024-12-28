# Web Builder
FROM node:18 AS web-builder

WORKDIR /app

COPY ./web/package.json ./web/package-lock.json ./

RUN npm install

COPY ./web .

RUN npm run build

FROM golang:1.23 AS builder

WORKDIR /app

# Server Builder
COPY ./server/go.mod ./server/go.sum ./
RUN go mod download

COPY ./server .

RUN go build -o server main.go

FROM debian:bookworm-slim

WORKDIR /root/

COPY --from=builder /app/server .
COPY --from=web-builder /app/dist ./dist

EXPOSE 8080

CMD ["./server"]