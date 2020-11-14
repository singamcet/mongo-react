FROM node:10
# Set the working directory to /client
WORKDIR /react_orders
# copy package.json into the container at /client
COPY package*.json /react_orders/
# install dependencies
RUN npm install
# Copy the current directory contents into the container at /client
COPY . /react_orders/
# Make port 3000 available to the world outside this container
EXPOSE 3000
# Run the app when the container launches
CMD ["npm", "start"]