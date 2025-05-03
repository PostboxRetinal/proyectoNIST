# Dockerfile for User Service
FROM docker.io/oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 4001

CMD ["bun", "run", "dev"]
