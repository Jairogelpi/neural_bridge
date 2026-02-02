# Build stage with full Go environment
FROM golang:1.22-alpine AS build
RUN apk add --no-cache git
WORKDIR /app
COPY . .
RUN go mod tidy && go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o /bin/api ./cmd/api

# Runtime stage
FROM alpine:3.19
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=build /bin/api /app/api
COPY --from=build /app/internal/db/migrate.sql /app/internal/db/migrate.sql
COPY --from=build /app/scripts/migrate.sh /app/migrate.sh
RUN chmod +x /app/migrate.sh
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["/app/api"]
