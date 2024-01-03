const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;


//use bodyparse
app.use(bodyParser.json());

//middleware - use express.json for all incoming requests (parse req. with json payloads and make data available at req.body)
app.use(express.json());

//allow req. from different domains
app.use(cors());

//use urlencoded (parse req. with url-encoded payloads)
app.use(express.urlencoded({ extended: true }));

//------DB setup-----
//mongo env var
const databaseUri = process.env.REACT_APP_MONGO_URI;

// connect to MongoDB
mongoose.connect(databaseUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//create db connection
const db = mongoose.connection;

//send indication of connection error
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//send indication of connection
db.once('open', () => {
  console.log('Connected to MongoDB');
});

//--------session and User (admin) setup------
const sessionSecret = process.env.REACT_APP_SESSION_SECRET;

//set up session
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

// set up Passport.js
app.use(passport.initialize());
app.use(passport.session());

//define user (admin) schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

// add a method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

//user model
const User = mongoose.model('User', userSchema, 'Userlist');

// passport Local Strategy using the User model
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, async (username, password, done) => {
  try {
    //find user with username
    const user = await User.findOne({ username });

    //if not exist, return message
    if (!user) {
      return done(null, false, { message: 'Incorrect username or password' });
    }

    // use the comparePassword method to check if the entered password is correct
    const isMatch = await user.comparePassword(password);

    //if password matches, return message accordingly
    if (isMatch) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect username or password' });
    }
  //catch errors
  } catch (error) {
    return done(error);
  }
}));

// serialize and deserialize users
//store user id in session cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//convert stored session to user object
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

//---------schemas and models------
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

//create model for book collection
const Book = mongoose.model('Book', bookSchema, "Booklist");

//create model for person collection
const Person = mongoose.model('Person', personSchema, "Personlist");

//create model for reservation collection
const Reservation = mongoose.model('Reservation', reservationSchema, "Reservationlist");

//------------Book endpoints----------
// get book list
app.get('/bookList', async (req, res) => {
  try {
    // fetch all books from the database
    const books = await Book.find();
    res.json(books);
    //catch error
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//save book to db
app.post('/saveBook', async (req, res) => {
  try {
    //new book object
    const newBook = new Book(req.body);
    //save
    await newBook.save();
    //send response back to client with book details
    res.json(newBook);
  } catch (error) {
    console.error('Error saving book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//update book stock by ID
app.put('/updateBook/:id', async (req, res) => {
  try {
    //set stock as request content
    const { stock } = req.body;

    // check if 'stock' is provided in the request body
    if (stock === undefined) {
      return res.status(400).json({ error: 'Invalid update. Stock parameter is required.' });
    }

    //set new stock
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: { quantity: stock } },
      { new: true }
    );

    if (!updatedBook) {
      console.log('Book not found');
      return null;
    } else {
      res.json(updatedBook);
      console.log('Book stock updated.');
    }
    //catch error
  } catch (error) {
    console.error('Error updating book stock:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//delete book by id
app.delete('/deleteBook/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted' });
  }
  //catch error
  catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//------------user end points--------
// get user list
app.get('/userList', async (req, res) => {
  try {
    // fetch all users from the database
    const users = await Person.find();
    res.json(users);
    //catch error
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//save user to db
app.post('/saveUser', async (req, res) => {
  try {
    //new person object
    const newPerson = new Person(req.body);
    //save
    await newPerson.save();
    //send response back to client with user details
    res.json(newPerson);
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//update user name by ID
app.put('/updateUser/:id', async (req, res) => {
  try {
    //set name and email as request content
    const { name, email } = req.body;

    // check if 'name' and 'email' is provided in the request body
    if (name === undefined || email === undefined) {
      return res.status(400).json({ error: 'Invalid update. All user parameters required.' });
    }

    //set new person
    const updatePerson = await Person.findByIdAndUpdate(
      req.params.id,
      { $set: { name: name, email: email } },
      { new: true }
    );

    if (!updatePerson) {
      console.log('User not found');
      return null;
    } else {
      res.json(updatePerson);
      console.log('User details updated.');
    }
    //catch error
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//delete user by id
app.delete('/deleteUser/:id', async (req, res) => {
  try {
    await Person.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  }
  //catch error
  catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//-------reservation endpoints------
// API endpoint to get the list of reservations
app.get('/reservationList', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).send('Internal Server Error');
  }
});

// make a reservation
app.post('/makeReservation', async (req, res) => {
  try {
    const { userId, selectedBooks } = req.body;

    // validate input
    if (!userId || !selectedBooks || selectedBooks.length === 0) {
      return res.status(400).json({ error: 'Invalid input. Please provide a valid user ID and selected books.' });
    }

    // fetch the user with the given userId
    const user = await Person.findById(userId);

    // check if the user is found
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // initialize reservations as an empty array if it's undefined
    if (!user.reservations) {
      user.reservations = [];
    }

    // get date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    // iterate through selected books and update stock
    for (const bookId of selectedBooks) {
      const book = await Book.findById(bookId);

      // check if the book is found
      if (!book) {
        console.error(`Book not found for ID: ${bookId}`);
        continue; // Skip to the next book if not found
      }

      // check if the book is in stock
      if (book.quantity > 0) {
        // Decrease the stock by 1
        book.quantity -= 1;
        await book.save();

        // record the reservation in the Reservation collection
        const reservation = new Reservation({
          userId,
          reservations: [
            {
              bookId: book._id,
              dateOfReservation: new Date(),
              dueDate: dueDate,
            },
          ],
        });

        await reservation.save();
      } else {
        console.error(`Book out of stock for ID: ${bookId}`);
      }
    }

    res.json({ message: 'Reservations made successfully.' });
  } catch (error) {
    console.error('Error making reservations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// increase book stock by ID (return book)
app.put('/returnBook/:userId/:bookId', async (req, res) => {
  try {
    const { userId, bookId } = req.params;

    // find the reservation by userId and bookId
    const reservation = await Reservation.findOne({
      userId,
      'reservations.bookId': bookId,
    });

    //if you don't find it, return error
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }

    // remove the returned book from the reservations list
    reservation.reservations = reservation.reservations.filter(
      (book) => book.bookId !== bookId
    );

    // save the updated reservation
    const updatedReservation = await reservation.save();

    // retrieve the book associated with the returned bookId
    const returnedBook = await Book.findById(bookId);

    // check if the book is found
    if (!returnedBook) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    // increase the stock by 1
    const updatedStock = returnedBook.quantity + 1;

    // update the book's stock using the existing logic
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { $set: { quantity: updatedStock } },
      { new: true }
    );

    if (!updatedBook) {
      console.log('Book not found');
      return res.status(404).json({ error: 'Book not found.' });
    }

    res.json({ message: 'Book returned successfully.' });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//-----login endpoints-----
// login route - authenticate via local username and password
// passport looks for req. body in the form of { username: 'example', password: 'password' }
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ success: true, message: 'Login successful' });
});

app.get('/logout', (req, res) => {
  console.log('Logging out...');
  req.logout(function (err) {
    if (err) {
      console.error('Logout error:', err);
      res.status(500).json({ success: false, message: 'Logout failed' });
    } else {
      res.json({ success: true, message: 'Admin logout successful' });
    }
  });
});

app.get('/checkAuth', (req, res) => {
  // check if the user is authenticated
  res.json({ isLoggedIn: req.isAuthenticated() });
});

//listen for connections on PORT port
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
