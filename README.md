# 📞 Phonebook

[![Heroku App Status](http://heroku-shields.herokuapp.com/peaceful-thicket-00015)](https://peaceful-thicket-00015.herokuapp.com)

A simple phonebook built with the MERN stack.

This application was developed as an exercises for [Full Stack Open 2020](https://www.fullstackopen.com/en).

## Deployment

The app is deployed on Heroku at [https://peaceful-thicket-00015.herokuapp.com/](https://peaceful-thicket-00015.herokuapp.com/).

## Scripts

### `npm start`

Run the server locally on `process.env.PORT` or `3001`.

### `npm run dev`

Run the server in development mode. The app will reload after any edit on `index.js`.

### `npm`

## Software

**Node.js** is a server-side javascript engine which can be used to provide dynamically generated content to the user on the client-side.

**Express** is a javascript library that is used to create web servers. It allows the easy creation of, for instance, a RESTful API.

**Nodemon** is an utility packages that monitors a node.js application for changes and automatically restarts the app if needed.

**REST client** is a VSCode extension that allows to run requests from the IDE.

## Exercise steps

1. Create a new application with `npm init && touch index.js`
2. Add required dependencies with `npm add express` and `npm add --dev nodemon`
3. Edit package.json to add following scripts:
`
  "start": "node index.js",
  "dev": "nodemon index.js",
`
4. Edit index.js:
  - Use express with CommonJS `require`
  - Create the routes