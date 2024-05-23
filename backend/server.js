// server.js
const cors = require("cors");
const fs = require("fs");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);

const corsOptions = {
  // origin: "http://localhost:3000",
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
// Set up CORS middleware
app.use(cors(corsOptions));

// Set up Socket.IO
const io = require("socket.io")(server, {
  cors: corsOptions,
});
app.use(express.static("public"));

app.get("/public/styles.css", (req, res) => {
  // Read the CSS file
  fs.readFile(__dirname + "/public/styles.css", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Internal Server Error");
    }

    // Set the Content-Type header to indicate that it's a CSS file
    res.setHeader("Content-Type", "text/css");

    // Send the CSS content as the response
    res.send(data);
  });
});

app.get("/chat/", (req, res) => {
  // res.sendFile(__dirname + "/html/index.html");
});

app.get("/chat/join-room", (req, res) => {
  // Read the index.html file
  fs.readFile(__dirname + "/html/index.html", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Internal Server Error");
    }

    // Extract the room name from the query parameters
    const room = req.query.room;
    // Inject the room name into the HTML content
    const modifiedHtml = data.replace("<!--#room_placeholder#-->", room);

    // Send the modified HTML content as the response
    // res.send(modifiedHtml);
  });
});

const users = {}; // Use plain object to store users and their nicknames
const usersRooms = {}; // Plain object to store the room each user is currently in
const roomUsers = {}; // Plain object to store the users in each room

const emitUsersInRoom = (room) => {
  io.to(room).emit("users in room", getUsersInRoom(room));
};

const getUsersInRoom = (room) => {
  return roomUsers[room] || [];
};

const addUserToRoom = (username, room) => {
  if (!roomUsers[room]) {
    roomUsers[room] = [];
  }
  roomUsers[room].push(username);
};

const removeUserFromRoom = (username, room) => {
  console.log(`this is room:${room}`);
  if (room == undefined || roomUsers[room] == undefined) {
    return;
  }
  const index = roomUsers[room].indexOf(username);
  if (index !== -1) {
    roomUsers[room].splice(index, 1);
    // emitUsersInRoom(room); // Emit the updated list of users in the room
  }
};

const joinRoom = (socket, newRoom) => {
  const username = users[socket.id] || socket.id;
  const oldRoom = getUserRoom(username); // Get the current room of the user
  removeUserFromRoom(username, oldRoom);
  usersRooms[username] = newRoom; // Update the user's room
  addUserToRoom(username, newRoom);

  socket.leaveAll();
  socket.join(newRoom);
  socket.emit("chat message", {
    msg: `Welcome ${username}, to the room: ${newRoom}`,
    user: "adm",
  });

  emitUsersInRoom(newRoom); // Emit the updated list of users in the new room
  emitUsersInRoom(oldRoom); // Emit the updated list of users in the old room
  console.log(`${username} joined room ${newRoom}`);
};

const getUserRoom = (username) => {
  return usersRooms[username] || "default";
};

io.on("connection", (socket) => {
  let username = socket.id;
  console.log(`${username} connected`);

  socket.on("disconnect", () => {
    const room = getUserRoom(username);
    removeUserFromRoom(username, room);
  });

  socket.on("set username", (name) => {
    if (Object.values(users).includes(name)) {
      socket.emit("chat message", {
        msg: `Username ${name}, already in use`,
        user: "adm",
      });
      socket.emit("usernameSetted false");
      return;
    }
    const oldUsername = username; // Store the old username
    const room = getUserRoom(oldUsername); // Get the current room based on the old username
    removeUserFromRoom(oldUsername, room); // Remove the user from the old room
    username = name; // Update the username
    users[socket.id] = name; // Update the username in the users object
    joinRoom(socket, room); // Join the room using the new username
    console.log(users);
    console.log("Username set");
  });

  socket.on("join room", (room) => {
    joinRoom(socket, room);
  });

  socket.on("leave room", () => {
    const room = getUserRoom(username);
    removeUserFromRoom(username, room);
    joinRoom(socket, "default");
    console.log(`${username} left current room and joined default room`);
  });

  socket.on("chat message", (msg, room) => {
    if (!room || room.trim() === "") {
      room = getUserRoom(username);
    }
    console.log(`${username} message: ${msg} to room: ${room}`);
    io.to(room).emit("chat message", {
      msg: msg,
      user: username,
    });
  });

  joinRoom(socket, "default");
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
