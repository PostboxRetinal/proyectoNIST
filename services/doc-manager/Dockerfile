# Dockerfile for Company Service
FROM docker.io/oven/bun:latest

WORKDIR /doc-manager

COPY . .

RUN bun install

EXPOSE 4002

CMD ["bun", "run", "dev"]