FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application (Vite creates 'dist' folder, not 'build')
RUN npm run build

# Verify the build output
RUN ls -la dist/

# Production stage
FROM nginx:alpine AS production

# Copy built files from dist folder (not build)
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Verify files were copied
RUN ls -la /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]