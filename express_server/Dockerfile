# Use a lighter version of Node as a parent image
FROM node:10
# Set the working directory to /api
WORKDIR /express_server
# copy package.json into the container at /api
COPY package*.json /express_server/
# install dependencies
RUN npm install
# Copy the current directory contents into the container at /api
COPY . /express_server/
# Make port 80 available to the world outside this container
EXPOSE 3001
# Run the app when the container launches
CMD ["npm", "start"]