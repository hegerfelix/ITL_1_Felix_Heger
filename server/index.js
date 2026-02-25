const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const db = require('./models');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Routes
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Ionic Taxi API is running 🚀' });
});

// Sync database and start server
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database connected and synced.');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Unable to connect to the database:', err);
  });
