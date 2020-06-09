# Stage 1: Build our angular application
FROM node:lts-alpine3.11 AS build-artifacts
WORKDIR /usr/src/app
COPY . ./
RUN yarn install
RUN yarn build:prod

# Stage 2: copy only dist/ to the scratch base image
FROM scratch
COPY --from=build-artifacts /usr/src/app/dist /usr/src/app/dist
