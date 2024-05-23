export const handleSubmit = (e, socket, messageInput, room, setMessageInput) => {
  e.preventDefault();
  if (messageInput.trim() !== "" && socket) {
    socket.emit("chat message", messageInput, room);
    setMessageInput("");
  }
};

export const handleJoinRoom = (e, socket, room, setRoomSetted) => {
  e.preventDefault();
  socket.emit("join room", room);
  setRoomSetted((prev) => !prev);
};

export const handleLeaveRoom = (socket, setRoomSetted) => {
  socket.emit("leave room");
  setRoomSetted((prev) => !prev);
};

export const handleSetUsername = (e, username, originalUsername, socket, setUsername, setUsernameSetted) => {
  e.preventDefault();
  if (username !== originalUsername) {
    socket.emit("set username", username);
  }
  setUsernameSetted((prev) => !prev);
};
