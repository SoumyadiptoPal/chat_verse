import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ChatContext from "../context/ChatContext";
import { storage } from "./firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ClipLoader from "react-spinners/ClipLoader";

const Signup = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    pic: "",
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [flag, setFlag] = useState(false);
  const context = useContext(ChatContext);
  const { RegisterUser } = context;
  const [progress, setProgress] = useState(0);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(credentials);
    const success = await RegisterUser(credentials);
    if (success) {
      setFlag(false);
      navigate("/home");
    } else {
      setFlag(false);
      alert("Undetected Error has occured", "danger");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    // console.log(file.name);
    setFlag(true);

    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prog);
      },
      (error) => {
        console.log(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          credentials.pic = downloadURL;
          //   console.log(credentials.pic);
          setProgress(0);
          handleSubmit(e);
        });
      }
    );
  };

  const fileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
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
      <div className="cont3">{/* <img src="images/background.jpg" /> */}</div>
      <div className="cont2">
        <div id="header">Sign up</div>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <form id="forms">
          <div className="elements">
            <input
              type="text"
              className="form-control"
              value={credentials.name}
              onChange={onChange}
              id="name"
              name="name"
              placeholder="Enter Name"
            />
          </div>
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
          <div className="elements">
            <label htmlFor="file" className="form-label">
              Profile Picture&nbsp;&nbsp;
            </label>
            <input type="file" onChange={fileChange} />
            {progress > 0 && <progress value={progress} max="100" />}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button type="submit" className="button" onClick={handleUpload}>
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
