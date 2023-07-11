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
  const uniqueMsgs = new Set();
  return (
    <div>
      {messages.map((msg) => {
        if(uniqueMsgs.has(msg._id))
        return;
        uniqueMsgs.add(msg._id);
        return (
          <div>
            {msg.sender._id !== JSON.parse(localStorage.getItem("user"))._id ? (
              <div className="left" id={msg._id}>
                <img className="msgImg" src={msg.sender.pic} />
                <div className="lftText">
                  <span>{msg.sender.name}:</span>
                  <div id={`preview${msg._id}`}></div>{" "}
                  {<CreateMsg content={msg.content} id={msg._id} />}
                </div>
              </div>
            ) : (
              <div className="right" id={msg.id}>
                <div className="rgtText">
                  <div
                    style={{ maxWidth: "50vw" }}
                    id={`preview${msg._id}`}
                  ></div>
                  {<CreateMsg content={msg.content} id={msg._id} />}
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
