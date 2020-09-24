# 📞 Phonebook

[![Heroku App Status](http://heroku-shields.herokuapp.com/peaceful-thicket-00015)](https://peaceful-thicket-00015.herokuapp.com)

A simple phonebook built with the MERN stack.

## Disclaimer

This application was developed as an exercises for [Full Stack Open 2020](https://www.fullstackopen.com/en). **Because of European privacy laws concerns, this application is not to be used for business, and real data should not be stored in the database.**

## Features

+ Add, update and delete persons

## Deployment

The app is deployed on Heroku at [https://peaceful-thicket-00015.herokuapp.com/](https://peaceful-thicket-00015.herokuapp.com/).

## Scripts

### `npm start`

Run the server locally on `process.env.PORT` or `3001`.

### `npm run dev`

Run the server in development mode. The app will reload after any edit on `index.js`.

### `build:ui`

Generate a production build of the React frontend and copies it to the `build` directory.

### `deploy`

Deploys the application by pushing the master branch to Heroku.

### `deploy:full`

Same as `deploy`, but builds the frontend before deploying.

### `logs:prod`

Displays the Heroku logs

### `lint`

Validates code with ESLint

### `lint:fix`

Fixes code with ESLint