// Dotenv package
require("dotenv").config();

// Express package
const express = require("express");
// Logging middleware
const morgan = require("morgan");
// Cross-origin resource sharing middleware
const cors = require("cors");

// Import Mongoose Person model
const Person = require("./models/person");

// Setup body token for Morgan to log
// a stringified version of the request
morgan.token("body", (req) => JSON.stringify(req.body));

// Create a new app object
const app = express();

// Load the middlewares
app.use(express.json());
app.use(cors());
app.use(express.static("build"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

/**
 * Info route
 *
 * Returns basic information about the phonebook
 */
app.get("/info", (request, response, next) => {
  Person.countDocuments()
    .then((count) => {
      return `
        <p>Phonebook has information for ${count} people</p>
        <p>${new Date()}</p>
      `;
    })
    .then((html) => {
      response.send(html);
    })
    .catch((error) => next(error));
});

/**
 * API read route
 * Returns all the persons in JSON format
 */
app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => persons.map((person) => person.toJSON()))
    .then((formattedPersons) => {
      response.json(formattedPersons);
    })
    .catch((error) => next(error));
});

/**
 * API read route
 * Returns the person with the specified id
 */
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => person.toJSON())
    .then((formattedPerson) => {
      response.json(formattedPerson);
    })
    .catch((error) => next(error));
});

/**
 * API delete route
 * Deletes the persons with the specified id
 */
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

/**
 * API create route
 * Creates the person with the specified
 * name and number
 *
 * Will return an error if either name or number
 * is missing or name already exists
 */
app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  // Create a new person object
  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date(),
  });

  // Save the person to the database
  // Use promise chaining for cleaner code
  person
    .save()
    .then((savedPerson) => savedPerson.toJSON())
    .then((savedAndFormattedPerson) => {
      response.json(savedAndFormattedPerson);
    })
    .catch((error) => next(error));
});

/**
 * API update route
 *
 * Updates the person with the specified id
 * with the new name and number
 */
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then((updatedPerson) => updatedPerson.toJSON())
    .then((updatedAndFormattedPerson) => {
      response.json(updatedAndFormattedPerson);
    })
    .catch((error) => next(error));
});

/**
 * Catch any request that did not find a valid route
 * and return an error message with 404 status
 */
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// Register unknownEndpoint middleware
app.use(unknownEndpoint);

/**
 * Handle errors based on error name
 * and returns an error message with 400 status
 */
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  // Check for the error type and return it
  // with a 400 status code
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// Register the error handling middleware
app.use(errorHandler);

// Port to listen on
const PORT = process.env.PORT;

/**
 * Start the server on the specified port
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
