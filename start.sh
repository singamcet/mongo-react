# !/bin/bash
mongoimport --port 27017 --db orders --collection orders --file mongo_seed/orders.json
mongoimport --port 27017 --db orders --collection products --file mongo_seed/products.json
mongoimport --port 27017 --db orders --collection users --file mongo_seed/users.json

npm install

npm start --prefix express_server & npm start --prefix react_orders


