import { Link } from "react-router-dom";
import "./Register.css";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3002/register", {
        username,
        email,
        password,
      });
      console.log(response.data);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User registered successfully",
      });
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log("There was an error registering!", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "There was an error registering!",
      });
    }
  };

  return (
    <section className="r0">
      <form className="r1" onSubmit={handleSubmit}>
        <div className="r2">
          <svg
            className="r3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
          >
            <path d="M211.2 96a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zM32 256c0 17.7 14.3 32 32 32h85.6c10.1-39.4 38.6-71.5 75.8-86.6c-9.7-6-21.2-9.4-33.4-9.4H96c-35.3 0-64 28.7-64 64zm461.6 32H576c17.7 0 32-14.3 32-32c0-35.3-28.7-64-64-64H448c-11.7 0-22.7 3.1-32.1 8.6c38.1 14.8 67.4 47.3 77.7 87.4zM391.2 226.4c-6.9-1.6-14.2-2.4-21.6-2.4h-96c-8.5 0-16.7 1.1-24.5 3.1c-30.8 8.1-55.6 31.1-66.1 60.9c-3.5 10-5.5 20.8-5.5 32c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32c0-11.2-1.9-22-5.5-32c-10.8-30.7-36.8-54.2-68.9-61.6zM563.2 96a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zM321.6 192a80 80 0 1 0 0-160 80 80 0 1 0 0 160zM32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32H608c17.7 0 32-14.3 32-32s-14.3-32-32-32H32z" />
          </svg>
        </div>
        <span className="title">Sign up</span>

        <div className="u1">
          <div className="container2">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              type="text"
              className="input2"
            />
            <label className="label2">Username</label>
          </div>
        </div>

        <div className="u1">
          <div className="container2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              className="input2"
            />
            <label className="label2">Email</label>
          </div>
        </div>

        <div className="u1">
          <div className="container2">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="text"
              className="input2"
            />
            <label className="label2">Password</label>
          </div>
        </div>

        <div className="bs1">
          <button type="submit" className="shadow__btn">
            Sign Up
          </button>
        </div>

        <div className="form-section">
          <p>
            Have an account? <Link to="/">Log in </Link>
          </p>
        </div>
      </form>
    </section>
  );
};

export default Register;
