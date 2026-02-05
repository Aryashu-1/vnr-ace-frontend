# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install dependencies
# Using "npm ci" if lockfile exists meant for npm, else install. 
# Since we have both lock files potentially, let's stick to npm install to be safe if package-lock is out of sync or missing.
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"]

