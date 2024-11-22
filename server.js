import express from 'express';
import mysql from 'mysql2/promise'; // MariaDB compatible
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config(); // Load environment variables

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'default_db_name',
};

let db;

async function connectToMariaDB() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('Connected to MariaDB');
  } catch (error) {
    console.error('MariaDB connection failed:', error.message);
    process.exit(1); // Exit process if unable to connect
  }
}

app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for user signup
app.post('/signup', async (req, res) => {
  const { email, password, first_name, last_name, phone_number } = req.body;

  if (!email || !password || !first_name || !last_name) {
    return res.status(400).send('Email, password, first name, and last name are required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send('Invalid email format');
  }

  try {
    const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).send('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into MariaDB
    const result = await db.execute(
      'INSERT INTO users (email, password, first_name, last_name, phone_number) VALUES (?, ?, ?, ?, ?)', 
      [email, hashedPassword, first_name, last_name, phone_number]
    );

    console.log('Data inserted:', result);

    // Redirect to the login page after successful signup
    res.redirect('/login');
  } catch (err) {
    console.error('Error in signup process:', err.message);
    res.status(500).send('Error registering user');
  }
});

// API endpoint for user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  try {
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).send('Invalid email or password');
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Invalid email or password');
    }

    res.send('Login successful');
  } catch (err) {
    console.error('Error logging in:', err.message);
    res.status(500).send('Error logging in');
  }
});

connectToMariaDB();

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});