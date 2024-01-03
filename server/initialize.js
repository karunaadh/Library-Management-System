const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//mongo env var
const databaseUri = process.env.REACT_APP_MONGO_URI;

//connect to db
mongoose.connect(databaseUri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to the database');

  try {
    // insert test data here
    await insertTestData();

    // insert an admin user
    await insertAdminUser();

    // close the database connection after inserting data
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
});

// MongoDB schema for book
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  quantity: Number,
});

// MongoDB schema for person
const personSchema = new mongoose.Schema({
  name: String,
  email: String,
});

// MongoDB schema for reservation
const reservationSchema = new mongoose.Schema({
  userId: String,
  reservations: [
    {
      bookId: String,
      dateOfReservation: Date,
      dueDate: Date,
    },
  ],
});

// MongoDB schema for user
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

// hash the password before saving it to the database
userSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

// create a model for the book collection
const Book = mongoose.model('Book', bookSchema, 'Booklist');

// create a model for the person collection
const Person = mongoose.model('Person', personSchema, 'Personlist');

// create a model for the reservation collection
const Reservation = mongoose.model('Reservation', reservationSchema, 'Reservationlist');

// create a model for the user collection
const User = mongoose.model('User', userSchema, "Userlist");

async function insertTestData() {
  // sample data for the 'books' collection
  const booksData = [
    { title: 'Book x', author: 'Author x', quantity: 10 },
    { title: 'Book y', author: 'Author y', quantity: 5 },
    // add more sample data as needed
  ];

  // insert data into the 'books' collection
  const insertedBooks = await Book.insertMany(booksData);

  // sample data for the 'persons' collection
  const personsData = [
    { name: 'Person x', email: 'x@gmail.com' },
    { name: 'Person y', email: 'y@gmail.com' },
  ];

  // insert data into the 'persons' collection
  const insertedPersons = await Person.insertMany(personsData);

  // add a dummy reservation for initialization
  const userId = insertedPersons[0]._id; // assuming the first person is 'Person 1'
  const bookId = insertedBooks[0]._id; // assuming the first book is 'Book 1'

  // Calculate due date (7 days from now)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  // Record the dummy reservation in the 'reservations' collection
  const reservationData = {
    userId: userId,
    reservations: [
      {
        bookId: bookId,
        dateOfReservation: new Date(),
        dueDate: dueDate,
      },
    ],
  };

  await Reservation.create(reservationData);

  console.log('Test data inserted successfully');
}

async function insertAdminUser() {
  const adminUsername = 'admin';
  const adminPassword = 'adminpass';

  // Check if the admin user already exists
  const existingAdmin = await User.findOne({ username: adminUsername });

  if (!existingAdmin) {
    // Create a new admin user
    const adminUser = new User({ username: adminUsername, password: adminPassword });

    // Save the admin user to the database
    await adminUser.save();

    console.log('Admin user inserted successfully');
  } else {
    console.log('Admin user already exists');
  }
}
