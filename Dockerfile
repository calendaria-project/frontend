FROM node:14-alpine as builder
WORKDIR '/app'
COPY package.json .
# RUN npm install -g npm@9.5.1

ARG NPM_BUILD_SCRIPT

RUN npm install
# RUN npm audit fix --force
COPY . .
RUN npm run  ${NPM_BUILD_SCRIPT}

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
