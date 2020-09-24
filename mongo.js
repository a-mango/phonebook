/*
 * @fileoverview This script perfmorms manipulations 
 * on the phonebook database using the mongoose library.
 *
 * Example usage:
 * node mongo.js <passowrd>
 * node mongo.js <passowrd> Anna 040-1234556
 * node mongo.js <passowrd> "Arto Vihavainen" 045-1232456
 */

const mongoose = require('mongoose')

console.log('Started database script')

// Check if password was provided
if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  process.exit(1)
}

// Extract password and connect to the database
const password = process.argv[2]
const url = `mongodb+srv://user01:${password}@cluster0.wnfvf.mongodb.net/phonebook-app?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// Define the person schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
})

// Create a new Person model
const Person = mongoose.model('Person', personSchema)

// Save a person to the database using mongoose
const addPerson = (name, number) => {
  const person = new Person({
    name: name,
    number: number,
    date: new Date(),
  })

  person.save().then((result) => {
    console.log(`Added entry ${result.name} with number ${result.number} to the phonebook`)
    mongoose.connection.close()
  })
}

// List all the persons in the database
const listPersons = () => {
  console.log('Phonebook entries:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

// Decide wheter to list all entries or add a new entry
// based on the number of provided arguments
if (process.argv.length === 3) {
  listPersons()
} else if (process.argv.length >= 4) {
  const name = process.argv[3]
  const number = process.argv[4]
  addPerson(name, number)
}