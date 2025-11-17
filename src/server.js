const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const app = express();

// Import des routes
const authRoutes = require('./routes/authroutes');
const donorRoutes = require('./routes/donorroutes');
const bloodBagRoutes = require('./routes/bloodbagroutes');
const patientRoutes = require('./routes/patientroutes');
const transfusionRoutes = require("./routes/transfusionroutes");
const reportRoutes = require('./routes/reportroutes');
const userRoutes = require("./routes/userroutes");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/bloodbags', bloodBagRoutes);
app.use('/api/patients', patientRoutes);
app.use("/api/transfusions", transfusionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);

// ⚡ Création du serveur HTTP et Socket.io
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Mettre io accessible dans les routes
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Client connecté :', socket.id);
});

// Lancer le serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
