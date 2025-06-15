# Build React App
FROM node:18-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --progress=false  # faster compared to npm install
COPY . .
RUN npm run build

# Serve with Nginx
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
