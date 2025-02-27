# Base image
FROM node:22

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Copy the .env and .env.development files
#COPY .env .env.development ./

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3004

# Start the server using the production build
CMD ["npm", "run", "start"]

#sudo docker build -t tm-appointment-validation-back-[version] .
#sudo docker run -p 3004:3004 tm-appointment-validation-back-[version]