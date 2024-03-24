# Use a base image with Node.js and Chromium installed
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN yarn

COPY Frontend/package*.json ./

RUN cd Frontend && yarn

COPY Backend/package*.json ./

RUN cd Backend && yarn

RUN yarn upgrade

RUN yarn electron:build

# Copy the Electron application source code into the container
COPY . .

EXPOSE 8080

CMD ["npm", "electron:serve"]
