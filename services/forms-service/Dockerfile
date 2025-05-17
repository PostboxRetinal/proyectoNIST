FROM docker.io/oven/bun:1.2.12-alpine

WORKDIR /forms-manager

COPY . .

RUN bun install

EXPOSE 4003

CMD ["bun", "run", "dev"]