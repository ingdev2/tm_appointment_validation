# Use the official Node.js 18-alpine image as the base image for the build stage
FROM node:18-alpine AS build

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code to the container
COPY . .

# Build the Next.js app
RUN npm run build

# Use the official Node.js 18-alpine image as the base image for the runtime stage
FROM node:18-alpine AS runtime

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the built app from the build stage to the runtime stage
COPY --from=build /app/.next ./.next

# Copy the public folder from the build stage to the runtime stage
COPY --from=build /app/public ./public

# Expose the port on which the app will run
EXPOSE 4004

USER node

# Start the Next.js app
CMD ["npm", "start"]

#sudo docker build -t tm-appointment-validation-front-[version] .
#sudo docker run -p 4004:4004 tm-appointment-validation-front-[version]