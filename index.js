const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const app = express();
const port = 4000;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

// Create a PostgreSQL connection pool
const connectionString = 'postgres://mpgsibel:tHrkVGaenh3EptPWxt-C9xlkHhaQBw7w@cornelius.db.elephantsql.com/mpgsibel';

const pool = new pg.Pool({
  connectionString: connectionString,
});


// Endpoint to create a new account
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Insert a new account into the database
    const result = await pool.query(
      'INSERT INTO account (username, password) VALUES ($1, $2) RETURNING *',
      [username, password]
    );

    // Get the newly created account from the result
    const createdAccount = result.rows[0];

    res.status(201).json({ message: 'Account created successfully', account: createdAccount });
  } catch (error) {
    console.error('Error creating an account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all accounts
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM account');
    const accounts = result.rows;
    
    res.json({ message: 'All accounts retrieved successfully', accounts });
  } catch (error) {
    console.error('Error retrieving accounts from the database:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start express server
app.listen(port, () => {
  console.log(`Serveur Express en cours d'exécution sur le port ${port}`);
});


// Export the Express API
module.exports = app