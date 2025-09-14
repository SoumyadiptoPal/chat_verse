import React, { useContext, useEffect } from "react";
import "../stylesheets/MsgContainer.css";
import ChatContext from "../context/ChatContext";
import CreateMsg from "./CreateMsg";
const MsgContainer = () => {
  const context = useContext(ChatContext);
  const { fetchMessages, messages, selectedchat } = context;
  useEffect(() => {
    fetchMessages();
  }, []);

  function extractTime12Hr(timestamp) {
    const date = new Date(timestamp);
    let hours = date.getUTCHours(); 
    let minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes.toString().padStart(2, "0");
    return `${hours}:${minutes} ${ampm}`;
  }
  
  const uniqueMsgs = new Set();
  return (
    <div>
      {messages.map((msg) => {
        if (uniqueMsgs.has(msg._id)) return;
        uniqueMsgs.add(msg._id);
        return (
          <div>
            {msg.sender._id !== JSON.parse(localStorage.getItem("user"))._id ? (
              <div className="left" id={msg._id}>
                <img className="msgImg" src={msg.sender.pic} />
                <div className="lftText">
                  <div className="msgInfo">
                    <span>{msg.sender.name}</span>
                    <span>{extractTime12Hr(msg.createdAt)}</span>
                  </div>
                  <div
                    className="messages"
                    style={{ borderTopLeftRadius: "0px" }}
                  >
                    <div id={`preview${msg._id}`}></div>{" "}
                    {<CreateMsg content={msg.content} id={msg._id} />}
                  </div>
                </div>
              </div>
            ) : (
              <div className="right" id={msg.id}>
                <div className="rgtText">
                  <div className="msgInfo">
                    <span>You</span>
                    <span>{extractTime12Hr(msg.createdAt)}</span>
                  </div>
                  <div
                    className="messages"
                    style={{ borderTopRightRadius: "0px" }}
                  >
                    <div
                      style={{ maxWidth: "50vw" }}
                      id={`preview${msg._id}`}
                    ></div>
                    {<CreateMsg content={msg.content} id={msg._id} />}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MsgContainer;
