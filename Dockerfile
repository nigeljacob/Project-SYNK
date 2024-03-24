# Use a base image with Node.js and Chromium installed
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install dependencies for the main application
RUN npm install

# Copy package.json and package-lock.json for the frontend
COPY Frontend/package*.json ./Frontend/

# Install dependencies for the frontend
RUN cd Frontend && npm install

# Copy package.json and package-lock.json for the backend
COPY Backend/package*.json ./Backend/

# Install dependencies for the backend
RUN cd Backend && npm install

# Copy the Electron application source code into the container
COPY . .

# Build the Electron app
RUN npm run electron:build
