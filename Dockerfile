FROM node:16-alpine as builder
WORKDIR '/app'
COPY package.json .
RUN npm install -g npm@9.5.1
RUN npm audit fix --force
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html