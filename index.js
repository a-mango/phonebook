require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

// Setup morgan tokens
morgan.token("body", (req) => JSON.stringify(req.body));

// Create a new app object
const app = express();

// Load middlewares
app.use(express.json());
app.use(cors());
app.use(express.static("build"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

/**
 * Home route
 */
app.get("/", (request, response) => {
  const html = `
    <p>Phonebook has information for ${persons.length} people</p>
    <p>${new Date()}</p>
  `;

  response.send(html);
});

/**
 * API read route
 * Returns all the persons in JSON format
 */
app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((notes) => {
      response.json(notes);
    })
    .catch((error) => next(error));
});

/**
 * API read route
 * Returns the person with the specified id
 */
app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((note) => {
      response.json(note);
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

app.post("/api/persons", (request, response) => {
  const body = request.body;

  // If request body is not valid, return 400 error
  if (body.name === undefined) {
    return response.status(400).json({
      error: "name missing",
    });
  } else if (body.number === undefined) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  // Create a new person object
  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date(),
  });

  // Save the person to the database
  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

/**
 * Catch any request that did not find a valid route
 */
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

/**
 * Finds if a person with an equal name value
 * already exists in the list
 *
 * @param {string} name The value to check for
 */
const nameExists = (name) => persons.some((person) => person.name === name);

/**
 * Generate an ID using Math.random,
 * Math.round and the exponential operator
 * Warning: is not collision-free
 */
const generateId = () => {
  return Math.round(Math.random() * 10 ** 10);
};

// Port to listen on
const PORT = process.env.PORT;

/**
 * Start the server on the specified port
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
