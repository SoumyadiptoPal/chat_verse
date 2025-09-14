import React, { useContext, useEffect } from "react";
import "../stylesheets/ChatList.css";
import ChatContext from "../context/ChatContext";
import { Avatar } from "@mui/material";

const ChatList = ({ chatType }) => {
  const context = useContext(ChatContext);
  const { accessChat, selectedchat, accessGroupChat, chats, fetchAllChats } =
    context;
  useEffect(() => {
    fetchAllChats();
  }, []);
  const handleE = (chat) => {
    if (chat.isGroupChat) {
      accessGroupChat(chat);
    } else {
      accessChat(getName(chat.users)._id);
    }
  };
  const getName = (Users) => {
    if (JSON.parse(localStorage.getItem("user"))._id === Users[0]._id) {
      if (Users[1]) return Users[1];
    } else {
      return Users[0];
    }
  };
  function removeHTMLTags(htmlString) {
    var text = htmlString.replace(/<[^>]+>/g, "");
    if (text.length > 25) {
      text = text.slice(0, 25) + "...";
    }
    return text;
  }
  const checkChatType = (isGrpChat, userCnt) => {
    if (userCnt < 2) return false;
    if (chatType == "All") return true;
    else if (chatType == "Personal") return !isGrpChat;
    else return isGrpChat;
  };
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
  return (
    <div>
      {chats &&
        chats.map((Chat) => {
          if (checkChatType(Chat.isGroupChat, Chat.users.length))
            return (
              <div
                className="profileItem"
                key={Chat._id}
                onClick={() => handleE(Chat)}
                style={
                  selectedchat && selectedchat._id === Chat._id
                    ? { backgroundColor: "skyblue" }
                    : {}
                }
              >
                <div className="profileimg">
                  <Avatar alt={(Chat.isGroupChat)?Chat.chatName:getName(Chat.users).name} src={(Chat.isGroupChat)?'images/grpicon.jpg':getName(Chat.users).pic} />
                  {/* <img
                    src={
                      Chat.isGroupChat
                        ? "images/grpicon.jpg"
                        : getName(Chat.users).pic
                    }
                  /> */}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    width:"100%",
                  }}
                >
                  <div>
                    <div className="chatListInfo">
                      <span>
                        {Chat.isGroupChat
                          ? Chat.chatName
                          : getName(Chat.users).name}
                      </span>
                      <span>
                        {Chat.latestMessage &&
                          extractTime12Hr(Chat.latestMessage.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div style={{fontSize:"small"}}>
                    {Chat.latestMessage &&
                      removeHTMLTags(Chat.latestMessage.content)}
                  </div>
                </div>
              </div>
            );
        })}
    </div>
  );
};

export default ChatList;
