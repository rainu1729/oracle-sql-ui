# Stage 1: Build the React application
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies
# Using 'npm ci' is recommended for CI/CD environments as it uses the lock file
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the application for production
# This will create a 'dist' folder with the static files
RUN npm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:stable-alpine

# Copy the built assets from the 'builder' stage
# The default build output for Vite is the 'dist' directory
COPY --from=builder /app/dist /usr/share/nginx/html

# When refreshing a page on a route like /about, Nginx needs to be
# configured to fall back to index.html to let React Router handle it.
# We will create a custom Nginx configuration for this.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx and keep it in the foreground
CMD ["nginx", "-g", "daemon off;"]