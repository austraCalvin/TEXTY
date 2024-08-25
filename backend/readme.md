# Texty backend

Texty backend is based on NodeTS and express. The former is the well-known JavaScript runtime environment used in its typescript version, and the latter is a JavaScript framework which makes the backend setup simple.

Before continuing to giving instructions to set up the backend, a mongodb connection needs to be established.

If you want to set a different host for the connection, just go to [Model.ts](/src/DAO/Database/Model.ts). You will find an object at the line 49 which is used for specifying the connection properties to be used for connecting to mongodb, be it through MongoAtlas or MongoDB locally.

## Get started
To install the dependencies needed in the backend just do: ```npm install```

## After installing
Run ```npm install -g ts-node```

## Once "ts-node" is installed
In this folder, run ```ts-node app.ts```. It will get the backend started on the port '27018'. If the previous command line does not work, just try ```npx ts-node app.ts```.

It will transpile the TypeScript code and immediately run it as it was JavaScript itself without creating a production environment. You will stay in the developmental environment and the TypeScript code will remain unchanged
