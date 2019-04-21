[![General Assembly Logo](https://camo.githubusercontent.com/1a91b05b8f4d44b5bbfb83abac2b0996d8e26c92/687474703a2f2f692e696d6775722e636f6d2f6b6538555354712e706e67)](https://generalassemb.ly)

# React Express Boilerplate

A one sentence description of the assignment.

* **[Getting Started](#getting-started):** Setting up the project directory.
* **[Express Setup](#express-setup):** Setting up Express boilerplate.
* **[Middleware Setup](#middleware-setup):** Setting up middleware.
* **[Sequelize Setup](#sequelize-setup):** Setting up Sequelize boilerplate.
* **[Define Models](#define-models):** Define the models.
* **[React Setup](#react-setup):** Setting up React boilerplate.

---

## Getting Started

1. Create a new directory called trebek_react_express_boilerplate

```bash
$ mkdir trebek_react_express_boilerplate
```

2. Change into the directory and run `git init` and `npm init`, respectively.

```bash
$ git init
$ npm init
```

The first command initializes an empty Git repository and the second walks you through creating a `package.json` file. The overall structure of the project will now look like this:

```bash
trebek_react_express_boilerplate

├── package.json
└── .git
```

3. Install the required dependencies (including sequelize)

```bash
$ npm install express morgan sequelize pg cors body-parser (back-end)
```

4. In the `trebek_react_express_boilerplate` directory, create a file called `server.js`; then add the `node_modules` folder to `.gitignore` to hide it from github. 

```bash
$ touch server.js
$ echo node_modules > .gitignore
```

5. The structure of the project will now look like this:

```bash
├── node_modules/
├── package.json
├── package.lock.json
├── server.js
└── .git
```

## Express Setup

6. In the server.js, add the [Express boilerplate code](https://expressjs.com/en/starter/hello-world.html):

```js
const express = require('express');
const cors = require('cors'); 

const app = express();

const PORT = process.env.PORT || 3000

app.get('/', async (req, res) => {
  try {
    res.send({ hello : "world" })
  } catch (e) {
    res.status(e.status).json({ msg: e.status })
  }
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
```
> This app starts a server and listens on port 3000 for connections. The app responds with “Hello World!” for requests to the root URL (/) or route. For every other path, it will respond with a **404 Not Found**.


7. In the `package.json`, add a scripts property that creates a command to run the server:

```js
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon server.js",
    "db:init": "dropdb --if-exists database_name_here && createdb database_name_here",
    "db:reset": "resetDb.js"
  },
```

8. Run the application by executing the following command:

```bash
$ npm run dev
```

then, load [localhost:3000](http://localhost:3000) in the browser to see the output.

9. At this point, the browser should return:

```js
{
hello: "world"
}
```

## Middleware Setup

An Express application is essentially a series of middleware function calls. [Middleware](https://expressjs.com/en/guide/using-middleware.html) functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. The next middleware function is commonly denoted by a variable named next.

- [**Morgan**](https://www.npmjs.com/package/morgan) is used for logging request details. You might think of it as a helper that collects logs from your server, such as your request logs. 

 Create a new morgan logger middleware function using the given format and options. The `format` argument may be a string of a predefined name (see documentaiton for more details). We will be using `dev` which provides output colored by response status for development use.

- Use [**bodyParser**](https://github.com/expressjs/body-parser) if you want form data to be available in `req.body`. `bodyParser.json()` returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option. A new body object containing the parsed data is populated on the request object after the middleware (i.e. `req.body`).

- This simeple use of [cors](https://expressjs.com/en/resources/middleware/cors.html) enables *all* CORS requests.

```js
const logger = require('morgan');
const bodyParser = require('body-parser');

app.use(cors())
app.use(bodyParser.json())

// log requests to the console in dev mode
app.use(logger(‘dev’));
```

## Sequelize Setup

1. Create a file called `models.js`.

```bash
$ touch models.js
```

In `models.js`, initialize the sequelize module using the global require function. We capitalize Sequelize to signify that in JS, this is a constructor function and should be called using the new operator.

This constructor function returns an object which represents a connection to the database. The first object is the name of the database that sequelize will connect to, in this case called `database_name_here`. We’re going to connect to the database using postgres and make sure all tables are defined with an underscore and always returns information.

```js
const Sequelize = require('sequelize');

const db = new Sequelize({
  database: 'database_name_here',
  dialect: 'postgres',
  define: {
    underscored: true,
    returning: true 
  }
});
```

## Define Models

Models are defined with:

```
connection.define('book', {attributes}, {options})
```

We do this using the connection object the Sequelize constructor object returned by placing the define function on the connection object. The model takes two arguments: (1) the name of the model -- in this case book -- and (2) an object that represents properties of the model -- in this case, title, author, and description.

For this example, we will be making a Book model:

```js
const Book = sequelize.define('book', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  author: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})
```
The values for the properties are the data types (e.g. title is of type STRING). Sequelize defines a primary key column automatically, so an id column is not required in your model definition.

```js
module.exports = {
  Book,
  db
}
```

#### Database Synchronization

1. Create a file called `resetDb.js`:

```
$ touch resetDb.js
```

2. Import the models and set up a function that will sync our models in the database and then close the connection. Because synchronizing and dropping all of your tables might be a lot of code to write, you can let Sequelize do the work for you:

```js
const { db } = require('../models');


const resetDb = async () => {
  try {
    db.sync({ force: true }); <------ force sync all models
    console.log('noice, database synced');
  } catch (e) {
    console.log(e);
  } finally {
    process.exit();
  }
}

resetDb();
```

The sync function, which creates the tables behind the scenes may take a long time to finish doing its job and we don’t want to try and attempt to insert data into a table that does not exist. The only way to know that the tables have been generated is to insert your record from within a callback function.

The `process.exit` function exits from the current Node.js process. It is a global variable that can be accessed from anywhere inside a Node.js program without using require to import it.

Now, run the following scripts we created earlier in the project:

```bash
$ npm db:init
$ npm db:reset
```

The database is now set up!

## React Setup

1. Create a new React app.

```bash
$ npm init react-app client
$ cd client
```

2. The project folder structure should look like the following:

> insert image

3. Now, let’s do some house cleaning:

To the `.gitignore` in the root folder, add the client node_modules folder:

```js
# dependencies
/node_modules
client/node_modules
```

4. In the **client** folder, delete the following files:

```
$ rm yarn.lock
$ rm .gitignore
```
5. In the **src** folder, delete the following files:

```
$ rm serviceWorker.js
$ rm logo.svg
```

6. Then, in the index.js file, delete all references to serviceWorker and in the src/App.js, delete the line that imports the logo.

7. Now, the src/App.js file should look similar to the following:

```js
import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Hello World</h1>
      </div>
    );
  }
}

export default App;
```
You’re ready to move on!

### Resources

- Express [Boilerplate](https://expressjs.com/en/starter/hello-world.html)
- Express [Basic Routing](https://expressjs.com/en/starter/basic-routing.html)

---

*Copyright 2018, General Assembly Space. Licensed under [CC-BY-NC-SA, 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)*
