import { useState, useEffect, useRef } from "react";
function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const URL = import.meta.env.VITE_API_WURL;

  const socketRef = useRef(null);
  useEffect(() => {
    socketRef.current = new WebSocket(`${URL}/ws/1/saurabh`);
    socketRef.current.onmessage = (event) => {
      console.log("message came");
      console.log(messages);
      setMessages((prev) => [...prev, event.data]);
    };
  }, []);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const sendmessage = () => {
    socketRef.current.send(input);
    setInput("");
    // setMessages((prev) => [...prev, input]);
  };
  return (
    <div className="bg-sky-900 w-full min-h-screen flex items-center justify-center flex-col gap-2 ">
      <div className="text-4xl text-sky-100 font-bold fixed top-0 bg-sky-950 w-full p-2 flex items-center justify-center">
        chat app
      </div>
      <div className="bg-sky-950 p-2 rounded-md w-1/2 overflow-y-auto h-125 scroll-">
        {messages.map((message, index) => {
          const msg = JSON.parse(message);
          return (
            <div key={index} className="flex flex-row gap-2">
              <div>{msg.username}:</div>
              <div>{msg.data}</div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-row gap-2 fixed bottom-0 w-full">
        <div className="h-fit w-11/12">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border-2 border-sky-950 rounded-md p-2 font-semibold text-sky-200 focus:outline-0 focus:border-b-2 focus:border-b-sky-400 caret-sky-500 w-full"
            spellCheck="false"
          />
        </div>
        <div
          onClick={sendmessage}
          className="cursor-pointer border border-sky-950 rounded-md p-2 font-semibold bg-sky-400 w-1/12"
        >
          submit
        </div>
      </div>
    </div>
  );
}

export default App;
