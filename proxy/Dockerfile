FROM node:18-alpine

WORKDIR /app

# Copy package.json first to leverage Docker caching
COPY package.json .

# Install dependencies from package.json
RUN npm install

# Copy application files
COPY server.js .
COPY etc /etc

# Create public directory for Let's Encrypt verification
RUN mkdir -p public/.well-known/acme-challenge

# Set environment variables with defaults
ENV PORT=3000
ENV HTTPS_PORT=3443
ENV DOMAIN_NAME=yourdomain.com

# Create volume for Let's Encrypt certificates
VOLUME ["/etc/letsencrypt"]

# Expose both HTTP and HTTPS ports
EXPOSE 3000 3443

CMD ["node", "server.js"]
