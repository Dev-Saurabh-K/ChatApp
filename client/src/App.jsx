import { useState, useEffect, useRef } from "react";
function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const socketRef = useRef(null);
  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8000/ws/1");
    socketRef.current.onmessage = (event) => {
      console.log("message came");
      setMessages((prev)=>([...prev, event.data]))
    };

  }, []);

  const sendmessage = () => {
    socketRef.current.send(input);
    setInput("");
    setMessages((prev) => ([...prev, input]));
  };
  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <div onClick={sendmessage}>submit</div>
      <div>
        {messages.map((message, index)=>(
          <div key={index}>{message}</div>
          
        ))}
      </div>
    </div>
  );
}

export default App;
