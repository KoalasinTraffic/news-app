# Build Express
FROM node:18-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --progress=false  # faster compared to npm install
COPY . .
RUN npm run build

# Production
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist

# Use non-root for security
RUN adduser --disabled-password appuser && chown -R appuser /app
USER appuser

EXPOSE 5000

CMD ["npm", "run", "server"]
