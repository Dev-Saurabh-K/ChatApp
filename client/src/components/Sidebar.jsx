import axios from "axios";
import { useEffect, useState } from "react";
import { useUsernameStore } from "../store/usernameStore";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const URL = `${import.meta.env.VITE_API_URL}/api/get/users`;
  const token = localStorage.getItem("access_token");
  const [users, setUsers] = useState([]);
  const setUsername = useUsernameStore((state)=>state.setUsername);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await axios.get(URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(user.data);
      console.log("set");
    };
    fetchUser();
  }, [token]);

  const handleClick = async (e)=>{
    setUsername(e.target.innerText);
    // navigate("/");
  }
  return (
    <div className="flex flex-col fixed left-0 w-full md:w-1/3 lg:w-1/4 xl:w-1/5 border border-sky-200 min-h-screen pl-2 gap-2">
      <h2 className="pl-4 font-semibold text-2xl">Chats</h2>
      <div className="h-fit w-full flex items-center justify-center flex-col">
        {users.map((user, index) => (
          <div
            key={index}
            className="w-full py-4  rounded-md flex items-center justify-center hover:bg-sky-500 cursor-pointer"
            onClick={(e)=>handleClick(e)}
          >
            {user.username}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
