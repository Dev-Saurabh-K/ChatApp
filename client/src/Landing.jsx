import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
// import { useUsernameStore } from "./store/usernameStore";

function Landing() {
  const navigate = useNavigate();
  const [room_id, setRoom_id] = useState(0);
  const handleClick = () => {
    navigate(`/${room_id}`);
  };
  // const username = useUsernameStore((state)=>state.username);
  return (
    <div className="w-full min-h-screen bg-sky-900 text-sky-50 flex items-center justify-center">
      <Sidebar/>
      <div className="flex flex-col items-center justify-center border border-blue-400 rounded-md p-8 gap-4">
        
        <div className="text-center">Room ID</div>
        {/* {username} */}
        <input
          type="text"
          name="room_id"
          value={room_id}
          onChange={(e) => setRoom_id(e.target.value)}
          className="text-sky-50 caret-sky-200 text-xl p-2 focus:outline-none text-center"
        />
        <div onClick={handleClick} className="p-2 bg-sky-500 rounded-md w-full cursor-pointer text-center">Go..</div>
      </div>
      
    </div>
  );
}

export default Landing;
