import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post(
        "http://localhost:8000/users/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      localStorage.setItem("access_token", response.data.access_token);
      console.log("Login successful");
      console.log(response.data);
      navigate("/landing")
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="bg-sky-900 flex w-screen min-h-screen flex-row justify-center items-center">
      <div className=" flex flex-col items-center justify-center gap-5 border rounded-md border-sky-100 p-8 bg-sky-800">
        <div className="text-sky-50 font-bold text-4xl flex items-center justify-center">
          chatapp
        </div>
        <div>
          
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="focus:outline-none focus:border-b-2 focus:border-sky-500 focus:bg-sky-400 rounded-md p-2 caret-sky-600 text-sky-50 font-semibold text-center"
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="focus:outline-none focus:border-b-2 focus:border-sky-500 focus:bg-sky-400 rounded-md p-2 caret-sky-600 text-sky-50 font-semibold text-center"
          />
        </div>
        <div onClick={handleLogin} className="bg-sky-950 text-white font-semibold px-4 py-2 rounded-md cursor-pointer w-full flex items-center justify-center">
          Login
        </div>
      </div>
    </div>
  );
};

export default Login;