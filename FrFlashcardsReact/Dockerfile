# Stage 1: Build the React application
FROM node:20-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Ensure correct permissions -- seems to be needed for Raspberry Pi / Linux,
# not sure about Windows
RUN chmod -R 755 /app

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build files to the Nginx web directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the application port (for example, using port 8081)
EXPOSE 8081

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
