import React, { useContext, useEffect, useState } from "react";
import "../stylesheets/Home.css";
import ChatList from "./ChatList";
import MsgContainer from "./MsgContainer";
import { Avatar, Box, Button, Modal, Typography, Drawer } from "@mui/material";
import ChatContext from "../context/ChatContext";
import SearchUsers from "./SearchUsers";
import Groups from "./Groups";
import ChatHeader from "./ChatHeader";
import InputMessage from "./InputMessage";
import { useNavigate } from "react-router-dom";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

const Home = () => {
  const context = useContext(ChatContext);
  const { fetchAllChats, chats, selectedchat } = context;
  const [chatType, setChatType] = useState("All");
  const width = useWindowWidth();
  const tabs = ["All", "Personal", "Groups"];
  const navigate = useNavigate();
  let user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    fetchAllChats();
  }, []);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const [open2, setOpen2] = useState(false);
  const toggle = () => setOpen2(!open2);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);
  const handleClose1 = () => setOpen1(!open1);

  const LogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  if (
    !localStorage.getItem("token") ||
    !localStorage.getItem("user") ||
    !user
  ) {
    return <div>Error while Logging in!! Try to log in Again</div>;
  } else {
    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={user.pic}
                style={{
                  height: "80px",
                  width: "80px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
              <h2>{user.name}</h2>
              <h3>{user.email}</h3>
              <div onClick={LogOut} style={{ color: "red", cursor: "pointer" }}>
                Log Out
              </div>
            </div>
          </Box>
        </Modal>
        <Modal
          open={open2}
          onClose={toggle}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Groups />
          </Box>
        </Modal>
        <div className="homeCont">
          {selectedchat && width < 768 ? null : (
            <div className="List">
              <div className="Search">
                <div className="UserProfile" onClick={handleOpen}>
                  <Avatar alt={user.name} src={user.pic} />
                  <div style={{ marginLeft: "10px" }}>{user.name}</div>
                </div>
                <div className="UserButton">
                  <div className="userbtn" onClick={handleClose1}>
                    <SearchSharpIcon />
                  </div>
                  <div className="userbtn" onClick={toggle}>
                    <GroupAddOutlinedIcon />
                  </div>
                </div>
                <Drawer anchor={"left"} open={open1} onClose={handleClose1}>
                  <SearchUsers setOpen1={setOpen1} option={1} />
                </Drawer>
              </div>
              <div className="chat-type-container">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`chat-type-btn ${
                      chatType === tab ? "active" : ""
                    }`}
                    onClick={() => setChatType(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="chatList">
                <ChatList chatType={chatType}/>
              </div>
            </div>
          )}

          {selectedchat ? (
            <div className="selected-chat-container">
              <ChatHeader />
              <div
                className="msgContainer"
                id="MsgCont"
                style={{
                  backgroundImage: "url('images/chatBackground2.webp')",
                  backgroundColor: "rgba(255, 255, 255, 0.6)", // blend with white
                  backgroundBlendMode: "overlay",
                }}
              >
                <MsgContainer />
              </div>
              <div className="inputMsg">
                <InputMessage />
              </div>
            </div>
          ) : width > 768 ? (
            <div
              className="selected-chat-container"
              style={{
                backgroundImage: "url('images/background.jpg')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "center",
                opacity: "0.5",
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }
};

export default Home;
