const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Make io accessible to routes
app.set('io', io);

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/tournaments', require('./routes/tournamentRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/players', require('./routes/playerRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
