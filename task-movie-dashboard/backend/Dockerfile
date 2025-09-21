FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Build the application
RUN npm run build
RUN npm install sqlite3

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start:prod"]
