FROM mongo

COPY users.json /users.json
CMD mongoimport --host mongodb --db orders --collection users --type json --file /users.json --jsonArray

COPY products.json /products.json
CMD mongoimport --host mongodb --db orders --collection products --type json --file /products.json --jsonArray

COPY users.json /users.json
CMD mongoimport --host mongodb --db orders --collection orders --type json --file /orders.json --jsonArray