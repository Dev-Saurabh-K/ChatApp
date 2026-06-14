import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Landing() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [room_id, setRoom_id] = useState(0);
  const handleClick = () => {
    navigate(`/${room_id}/${username}`);
  };
  return (
    <div>
      <div>
        <div>username</div>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div>room id</div>
        <input
          type="text"
          name="room_id"
          value={room_id}
          onChange={(e) => setRoom_id(e.target.value)}
        />
        <div onClick={handleClick}>Go..</div>
      </div>
      
    </div>
  );
}

export default Landing;
