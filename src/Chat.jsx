import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState("");
  const socket = useRef();

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        if (username.length > 0 && newMessage.trim().length === 0) {
          connect();
        } else if (newMessage.trim().length > 0) {
          handleSendMessage();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  });

  function connect() {
    socket.current = new WebSocket('ws://localhost:5000');

    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        event: "connection",
        username,
        id: Date.now(),
      };
      socket.current.send(JSON.stringify(message));
    };
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [message, ...prev]);
    };
    socket.current.onclose = () => {
      console.log("Chat was closed");
    };
    socket.current.onerror = () => {
      console.log("Something went wrong");
    };
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      const message = {
        event: 'message',
        username,
        message: newMessage,
        id: Date.now(),
      }
      socket.current.send(JSON.stringify(message));
      setNewMessage("");
    }
  };

  if (!connected) {
    return (
      <div className='container'>
        <div className='chat-container join-container'>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='text-area'
            placeholder='Enter your name...'
          />
          <button className='btn' onClick={connect}>
            Join
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='container'>
      <div className='chat-container'>
        <div className='messages'>
          {messages.map((message) => (
            <div key={message.id} className='message'>
              {message.event === "connection" ? (
                <div className='join-message'>
                  User <span className='username'>{message.username}</span>{" "}
                  joined the chat...
                </div>
              ) : (
                <div
                  className={`${
                    message.username === username ? "outcoming" : "incoming"
                  }`}
                >
                  <h6 className='username'>{message.username}</h6>
                  {message.message}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className='chat-textarea-container'>
          <input
            type='text'
            className='text-area chat-textarea'
            placeholder='Type your message...'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className='btn' onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;