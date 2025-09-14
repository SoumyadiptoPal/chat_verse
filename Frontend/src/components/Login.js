import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../stylesheets/Login.css";
import ChatContext from "../context/ChatContext";
import ClipLoader from "react-spinners/ClipLoader";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [flag, setFlag] = useState(false);
  const context = useContext(ChatContext);
  const { loginUser } = context;
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFlag(true);

    let success = await loginUser(credentials);
    if (success) {
      setFlag(false);

      navigate("/home");
    } else {
      setFlag(false);

      alert("ERROR:Invalid Credentials", "danger");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const override = {
    borderWidth: "5px",
  };
  return (
    <div className="cont1">
      {flag === true && (
        <div
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.5)",
            zIndex: 200,
          }}
        >
          <ClipLoader
            color="blue"
            loading={flag}
            size={50}
            cssOverride={{
              borderWidth: 5,
            }}
            width="30px"
            aria-label="Loading Spinner"
            data-testid="loader"
            borderWidth="20px"
          />
          <h3 style={{ marginLeft: "20px" }}>Please wait....</h3>
        </div>
      )}
      <div className="cont3"></div>
      <div className="cont2">
        <div id="header">Login</div>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
        <form onSubmit={handleSubmit} id="forms">
          <div className="elements">
            <input
              type="email"
              className="form-control"
              value={credentials.email}
              onChange={onChange}
              id="email"
              name="email"
              aria-describedby="emailHelp"
              placeholder="Enter Email"
            />
          </div>
          <div className="elements">
            <input
              type="password"
              className="form-control"
              value={credentials.password}
              onChange={onChange}
              name="password"
              id="password"
              placeholder="Enter Password"
            />
          </div>

          <button type="submit" className="button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
