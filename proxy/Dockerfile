FROM node:18-alpine

WORKDIR /app

# Copy application files
COPY server.js .
COPY package.json .

# Create public directory for Let's Encrypt verification
RUN mkdir -p public/.well-known/acme-challenge

# Set environment variables with defaults
ENV PORT=3000
ENV HTTPS_PORT=3443
ENV DOMAIN_NAME=yourdomain.com

# Install dependencies
RUN npm install express

# Create volume for Let's Encrypt certificates
VOLUME ["/etc/letsencrypt"]

# Expose both HTTP and HTTPS ports
EXPOSE 3000 3443

CMD ["node", "server.js"]
