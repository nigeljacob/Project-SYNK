# Use a base image with Node.js and Chromium installed
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install dependencies for the main application
RUN yarn

# Copy package.json and package-lock.json for the frontend
COPY Frontend/package*.json ./Frontend/

# Set the working directory to the frontend directory
WORKDIR /app/Frontend

# Install dependencies for the frontend
RUN yarn

# Set the working directory back to the root
WORKDIR /app

# Copy package.json and package-lock.json for the backend
COPY Backend/package*.json ./Backend/

# Set the working directory to the backend directory
WORKDIR /app/Backend

# Install dependencies for the backend
RUN yarn

# Set the working directory back to the root
WORKDIR /app

# Copy the Electron application source code into the container
COPY . .

# Build the Electron app
RUN yarn electron:build
