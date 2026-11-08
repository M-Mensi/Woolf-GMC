require("dotenv").config();

const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String],
});

const Person = mongoose.model("Person", personSchema);

function connectToDatabase() {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.includes("<")) {
    return Promise.reject(
      new Error("Set a valid MongoDB Atlas URI in the MONGO_URI value in .env.")
    );
  }

  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

function createAndSavePerson(done) {
  const person = new Person({
    name: "John Doe",
    age: 30,
    favoriteFoods: ["pizza", "burritos"],
  });

  person.save(done);
}

function createManyPeople(arrayOfPeople, done) {
  Person.create(arrayOfPeople, done);
}

function findPeopleByName(personName, done) {
  Person.find({ name: personName }, done);
}

function findOneByFood(food, done) {
  Person.findOne({ favoriteFoods: food }, done);
}

function findPersonById(personId, done) {
  Person.findById(personId, done);
}

function addFavoriteFood(personId, done) {
  Person.findById(personId, (err, person) => {
    if (err) {
      return done(err);
    }

    if (!person) {
      return done(new Error("Person not found."));
    }

    person.favoriteFoods.push("hamburger");
    person.save(done);
  });
}

function updatePersonAge(personName, done) {
  Person.findOneAndUpdate(
    { name: personName },
    { age: 20 },
    { new: true },
    done
  );
}

function deletePersonById(personId, done) {
  Person.findByIdAndRemove(personId, done);
}

function deletePeopleNamedMary(done) {
  Person.remove({ name: "Mary" }, done);
}

function findBurritoLovers(done) {
  Person.find({ favoriteFoods: "burritos" })
    .sort({ name: 1 })
    .limit(2)
    .select("-age")
    .exec(done);
}

module.exports = {
  Person,
  addFavoriteFood,
  connectToDatabase,
  createAndSavePerson,
  createManyPeople,
  deletePeopleNamedMary,
  deletePersonById,
  findBurritoLovers,
  findOneByFood,
  findPeopleByName,
  findPersonById,
  updatePersonAge,
};

if (require.main === module) {
  connectToDatabase()
    .then(() => console.log("Connected to MongoDB."))
    .catch((err) => {
      console.error("Could not connect to MongoDB:", err.message);
      process.exitCode = 1;
    });
}
