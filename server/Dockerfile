FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production  # lighter compared to npm install
COPY . .

EXPOSE 5000

# Use non-root for security
RUN adduser --disabled-password appuser && chown -R appuser /app
USER appuser

CMD ["npm", "run", "server"]
