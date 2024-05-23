export const renderUsernameForm = (usernameSetted, username, handleSetUsername, handleUsernameChange, setUsername) => {
  if (!usernameSetted) {
    return (
      <form className="margin-childs-v" onSubmit={handleSetUsername}>
        <input
          id="usernameInput"
          className="input-field"
          type="text"
          placeholder="Insert Nickname"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit" className="button">
          Set.
        </button>
      </form>
    );
  }
  return (
    <div>
      <button className="button" onClick={handleUsernameChange}>
        {username}
      </button>
    </div>
  );
};

export const renderRoomForm = (roomSetted, room, handleJoinRoom, handleLeaveRoom, setRoom) => {
  if (!roomSetted) {
    return (
      <form className="margin-childs-v" onSubmit={handleJoinRoom}>
        <input
          id="roomInput"
          className="input-field"
          placeholder="Room Name"
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button type="submit" className="button">
          Join
        </button>
      </form>
    );
  }
  return (
    <button className="button" onClick={handleLeaveRoom}>
      Leave room {room}
    </button>
  );
};

export const renderMessageList = (messages, username) => {
  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <p
          key={index}
          className={`message-bubble message-item ${
            message.user === username ? "sent" : message.user === "adm" ? "adm-msg" : "received"
          }`}
        >
          {message.user === "adm" ? `${message.msg}` : `${message.user} : ${message.msg}`}
        </p>
      ))}
    </div>
  );
};

export const renderUsersList = (usersList) => {
  console.log(usersList);
  return (
    <div className="users-list">
      {usersList.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </div>
  );
};

export const rendermessageForm = (handleSubmit, messageInput, setMessageInput) => {
  return (
    <form id="message-form" onSubmit={handleSubmit} className="centered-content-vh margin-childs-h width100">
      <textarea
        name="message-input"
        form="message-form"
        className="input-field width100"
        type="text"
        rows={2}
        style={{ resize: "none" }}
        autoCorrect="on"
        autoComplete="off"
        placeholder="Type a message..."
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
      />
      <button className="button" type="submit">
        Send
      </button>
    </form>
  );
};
