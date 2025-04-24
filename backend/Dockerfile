# Dockerfile for the backend service
FROM docker.io/oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 3000

CMD ["bun", "run", "dev"]
