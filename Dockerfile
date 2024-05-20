# Use an official Node.js 18 image as the base
FROM node:18alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install -f

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 1337

# Command to run build application
CMD ["npm","run", "develop"]

