FROM node:alpine3.19 AS build
WORKDIR /frontend
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# nginx configuration
FROM nginx:mainline-bookworm
COPY --from=build /frontend/dist /usr/share/nginx/html
COPY --from=build /frontend/.env.production /usr/share/nginx/html/.env.production
EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
