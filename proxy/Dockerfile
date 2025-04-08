FROM node:18-alpine

WORKDIR /app

COPY server.js .

# Set environment variables with defaults
ENV PORT=8080
ENV HOST_IP=localhost

EXPOSE 8080

CMD ["node", "server.js"]
