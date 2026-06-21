import Sidebar from "./components/Sidebar";
import {useUsernameStore}  from "./store/usernameStore"
import { useRecieverUsernameStore } from "./store/recieverUsernameStore";
import { useEffect, useRef, useState } from "react";


function Chat() {
  const socketRef = useRef(null);

  // const [receiver, setReceiver] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  // const username = localStorage.getItem("username");
  const username = useUsernameStore((state)=>state.username);
  const recieverusername = useRecieverUsernameStore((state)=>state.username);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) return;

    socketRef.current = new WebSocket(
      `${import.meta.env.VITE_API_WURL}/ws?token=${token}`
    );

    socketRef.current.onopen = () => {
      console.log("Connected");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setMessages((prev) => [...prev, data]);
    };

    socketRef.current.onerror = (error) => {
      console.log("WebSocket Error:", error);
    };

    socketRef.current.onclose = () => {
      console.log("Disconnected");
    };

    return () => {
      socketRef.current?.close();
    };
  }, [token]);

  const sendMessage = () => {
    if (!input.trim()) return;

    // if (!recieverusername.trim()) {
    //   alert("Enter receiver username");
    //   return;
    // }

    const payload = {
      recieverusername,
      message: input,
    };

    socketRef.current.send(JSON.stringify(payload));

    setMessages((prev) => [
      ...prev,
      {
        sender: username,
        message: input,
      },
    ]);

    setInput("");
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold">
          Logged in as: {username}
        </h1>
      </div>
      <Sidebar/>

      {/* Receiver */}
      {/* <div className="p-4 border-b border-slate-700">
        <input
          type="text"
          placeholder="Receiver Username"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          className="w-full p-2 rounded bg-slate-800 outline-none"
        />
      </div> */}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 flex ${
              msg.sender === username
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div className="bg-slate-800 rounded-lg p-3 max-w-md">
              <div className="text-xs text-slate-400 mb-1">
                {msg.sender}
              </div>
              <div>{msg.message}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700 flex gap-2">
        <input
          type="text"
          placeholder="Type message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded bg-slate-800 outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;