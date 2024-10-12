FROM node:alpine3.19 AS build

ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL

WORKDIR /frontend
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# nginx configuration
FROM nginx:mainline-bookworm
COPY --from=build /frontend/dist /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
