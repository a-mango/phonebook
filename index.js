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

// Dummy data used by the server
let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

/**
 * Home route
 */
app.get("/", (req, res) => {
  const html = `
  <p>Phonebook has information for ${persons.length} people</p>
  <p>${new Date()}</p>`;

  res.send(html);
});

/**
 * API read route
 * Returns all the persons in JSON format
 */
app.get("/api/persons", (req, res) => {
  Person.find({}).then((notes) => {
    res.json(notes);
  });
});

/**
 * API read route
 * Returns the person with the specified id
 */
app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((note) => {
    response.json(note);
  });
});

/**
 * API delete route
 * Deletes the persons with the specified id
 */
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  // If request body is not valid, return 400 error
  if (body.name === undefined) {
    return res.status(400).json({
      error: "name missing",
    });
  } else if (body.number === undefined) {
    return res.status(400).json({
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
  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

/**
 * Catch any request that did not find a valid route
 */
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

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
