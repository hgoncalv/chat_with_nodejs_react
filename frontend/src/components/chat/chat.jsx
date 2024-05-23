import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import {
  renderUsernameForm,
  renderRoomForm,
  renderMessageList,
  rendermessageForm,
  renderUsersList,
} from "./chatRenders";

import "./Chat.scss";
import AccordionItem from "../accordion/Accordion";
import { FaBars } from "react-icons/fa"; // Assuming you have imported the icon

const ChatApp = () => {
  const [username, setUsername] = useState("");
  const [usernameSetted, setUsernameSetted] = useState(false);
  const [originalUsername, setOriginalUsername] = useState("");
  const [room, setRoom] = useState("default");
  const [roomSetted, setRoomSetted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false); // State to manage sidebar visibility
  const messageListRef = useRef(null);

  useEffect(() => {
    if (messageListRef.current) {
      // Scroll to the bottom of the message list
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    // const newSocket = io("https://adrian-extent-sunny-daniel.trycloudflare.com");
    setSocket(newSocket); // Store the socket in state
    newSocket.on("chat message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    newSocket.on("users in room", (data) => {
      setUsersList(() => data);
    });

    newSocket.on("usernameSetted false", () => {
      setUsernameSetted(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageInput.trim() !== "" && socket) {
      socket.emit("chat message", messageInput, room);
      setMessageInput("");
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    socket.emit("join room", room);
    setRoomSetted((prev) => !prev);
  };

  const handleLeaveRoom = () => {
    socket.emit("leave room");
    setRoom("");
    setRoomSetted((prev) => !prev);
  };

  const handleSetUsername = (e) => {
    e.preventDefault();
    if (username !== originalUsername) {
      socket.emit("set username", username);
    }
    setUsernameSetted((prev) => !prev);
  };

  const handleUsernameChange = () => {
    setOriginalUsername(username);
    setUsernameSetted((prev) => !prev);
  };

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev); // Toggle sidebar visibility
  };

  return (
    <div className="outer-container">
      <div className="inner-container">
        <div className="left-div chat-container">
          <div className="top-div overflowAuto" ref={messageListRef}>
            {renderMessageList(messages, username)}
          </div>
          <div className="bottom-div centered-content-v">
            {rendermessageForm(handleSubmit, messageInput, setMessageInput)}
          </div>
        </div>

        <div className={`right-div centered-content-vh text-align-center ${showSidebar ? "" : "hidden"}`}>
          <div>
            <AccordionItem title="Nickname">
              {renderUsernameForm(usernameSetted, username, handleSetUsername, handleUsernameChange, setUsername)}
            </AccordionItem>
            <AccordionItem title="Select room">
              {renderRoomForm(roomSetted, room, handleJoinRoom, handleLeaveRoom, setRoom)}
            </AccordionItem>
            <AccordionItem title={`Room ${room}`}>{renderUsersList(usersList)}</AccordionItem>
            {/* Add more AccordionItems for additional sections */}
          </div>
        </div>

        <div className="toggle-sidebar" onClick={toggleSidebar}>
          <FaBars className="barsIcon" /> {/* Icon to toggle sidebar visibility */}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
