FROM node:23.4-alpine3.21 AS builder

USER root
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

FROM nginx:1.27-alpine3.21-slim

USER root
WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist/. ./
COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
