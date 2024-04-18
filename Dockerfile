# Use an official Node.js 18 image as the base
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install -f

# Copy the rest of the application code
COPY . .

# Expose cổng mà ứng dụng chạy trên
#EXPOSE 1337

# Command to run build application
CMD ["npm","run", "develop"]

