# Dockerfile for User Service
FROM docker.io/oven/bun:1.2.12-alpine

WORKDIR /user-service

COPY . .

RUN bun install

EXPOSE 4001

CMD ["bun", "run", "dev"]
