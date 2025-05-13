FROM docker.io/oven/bun:latest

WORKDIR /forms-manager

COPY . .

RUN bun install

EXPOSE 4003

CMD ["bun", "run", "dev"]