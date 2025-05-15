FROM docker.io/oven/bun:1.2.12-alpine

WORKDIR /company-service

COPY . .

RUN bun install

EXPOSE 4002

CMD ["bun", "run", "dev"]