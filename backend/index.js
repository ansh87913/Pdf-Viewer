// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"]
  }
});
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());

// In-memory store for room data (use a database in production)
const rooms = {};

// Handle PDF file serving (replace with your actual logic)
app.get('/pdf/:filename', (req, res) => {
  const filename = req.params.filename;
  // Implement logic to fetch and stream the PDF file
  // Example: res.sendFile(`./pdfs/${filename}`);
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);

    if (!rooms[roomId]) {
      rooms[roomId] = { currentPage: 1, users: [] };
    }
    rooms[roomId].users.push(userId);

    socket.emit('room-data', rooms[roomId].currentPage, rooms[roomId].users);
    socket.to(roomId).emit('user-joined', userId);
    socket.to(roomId).emit('user-list-updated', rooms[roomId].users);
  });

  socket.on('page-change', (roomId, userId, pageNumber) => {
    console.log(`User ${userId} changed page to ${pageNumber}`);
    rooms[roomId].currentPage = pageNumber;
    socket.to(roomId).emit('page-changed', pageNumber);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    // Find the room the user was in
    for (const roomId in rooms) {
      const userIndex = rooms[roomId].users.indexOf(socket.id);
      if (userIndex !== -1) {
        // Remove user from the room
        rooms[roomId].users.splice(userIndex, 1);

        // Broadcast updated user list to others in the room
        socket.to(roomId).emit('user-list-updated', rooms[roomId].users);

        // If the room is empty, delete it
        if (rooms[roomId].users.length === 0) {
          delete rooms[roomId];
        }

        break; // Exit the loop after finding the room
      }
    }
  });
});

http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});