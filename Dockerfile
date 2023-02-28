FROM node:12-alpine as builder
WORKDIR '/app'
COPY package.json .
# RUN npm install -g npm@9.5.1

RUN npm install
RUN npm audit fix --force
COPY . .
RUN npm run build

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html