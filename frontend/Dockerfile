FROM node:alpine3.19 AS build
WORKDIR /frontend
COPY package.json ./
RUN npm install
COPY . .
COPY ./env.production ./env.production
RUN npm run build

# nginx configuration
FROM nginx:mainline-bookworm
COPY --from=build /frontend/dist /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
