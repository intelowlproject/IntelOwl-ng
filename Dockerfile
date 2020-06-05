# Stage 1: Build our angular application
FROM node:lts-alpine3.11 AS build-artifacts
WORKDIR /usr/src/app
COPY . ./
RUN yarn install
RUN yarn build:prod

# Stage 2: copy only dist/ and serve it via nginx
FROM nginx:1.18.0-alpine
COPY angular-nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-artifacts /usr/src/app/dist /usr/share/nginx/html
