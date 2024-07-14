import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Login.css";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons/faCircleUser";
// import googleLogo from "../Logo/google.png";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3002/login", {
        usernameOrEmail,
        password,
      });
      localStorage.setItem("token", response.data.token);

      navigate("/products");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "There was an error logging in!",
      });
    }
  };

  return (
    <section className="l0">
      <div className="l1">
        <form onSubmit={handleSubmit} id="loginForm">
          <div className="l2">
            <FontAwesomeIcon icon={faCircleUser} />
          </div>
          <h1 className="hl">Login</h1>
          <div className="i1">
            <div className="group">
              <svg className="icon">
                <FontAwesomeIcon icon={faUser} />
              </svg>
              <input
                className="i2 input"
                type="text"
                placeholder="Username or email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="p1">
            <div className="group">
              <svg
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
              >
                <path
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
              </svg>
              <input
                className="input"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="b1">
            <a
              className="bn5"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("loginForm")
                  .dispatchEvent(
                    new Event("submit", { cancelable: true, bubbles: true })
                  );
              }}
            >
              Login
            </a>
          </div>
          <div className="s1">
            <p>
              Don&apos;t have an account? <Link to="/register">Sign Up</Link>{" "}
            </p>
          </div>

          {/* <div className="l3">
            <i>
              <img src={googleLogo} className="g1" alt="Google logo" />
            </i>
            <i>
              <svg
                className="f1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" />
              </svg>
            </i>
          </div> */}
        </form>
      </div>
    </section>
  );
};

export default Login;
