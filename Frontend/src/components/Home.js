import React, {useContext, useEffect,useState} from "react";
import "../stylesheets/Home.css"
import ChatList from "./ChatList";
import MsgContainer from "./MsgContainer";
import { Avatar, Box, Button, Modal,Typography,Drawer } from "@mui/material";
import ChatContext from '../context/ChatContext';
import SearchUsers from "./SearchUsers";
import Groups from "./Groups";
import ChatHeader from "./ChatHeader";
import InputMessage from "./InputMessage";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const context=useContext(ChatContext);
  const {fetchAllChats,chats,selectedchat}=context;
  const navigate = useNavigate();
  let user=JSON.parse(localStorage.getItem('user'));
  useEffect(()=>{
    fetchAllChats();
  let user=JSON.parse(localStorage.getItem('user'));
  },[])
  const [open,setOpen]=useState(false);
  const [open1,setOpen1]=useState(false);

  const [open2,setOpen2]=useState(false);
  const toggle = () => setOpen2(!open2);

  const handleOpen = () => setOpen(true);
  
  const handleClose = () => setOpen(false);
  const handleClose1 = () => setOpen1(!open1);

  const LogOut=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');

  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  if (!localStorage.getItem("token") || !localStorage.getItem("user") || !user) {
    return <div>Error while Logging in!! Try to log in Again</div>;
  } else {
    return(
    <div>
        <div className="head1">
            <div style={{color:"white", fontWeight:"bolder",fontSize:"3rem",margin:"20px"}}>Chat Verse</div><div style={{color:"white"}}>Connecting People</div>
            <Button onClick={handleOpen}><Avatar alt={user.name} src={user.pic} /></Button>
            </div>
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
              <Box sx={style}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <img src={user.pic} style={{height:"80px", width:"80px",objectFit:'cover', borderRadius:"50%"}}/>
                <h2>{user.name}</h2>
                <h3>{user.email}</h3>
                <div onClick={LogOut} style={{color:"red", cursor: "pointer"}}>Log Out</div>
                </div>
                </Box>
            </Modal>
            <Modal
            open={open2}
            onClose={toggle}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
              <Box sx={style}>
                <Groups/>
                </Box>
            </Modal>
        <div className="homeCont">
        <div className="List">
          <div className="Search">
          <button style={{height:"30px"}} onClick={handleClose1}>&#128269;</button>
          <button className="button" style={{padding:"10px"}} onClick={toggle}>
            Create Group
          </button>
          <Drawer
            anchor={"left"}
            open={open1}
            onClose={handleClose1}
          >
            <SearchUsers setOpen1={setOpen1} option={1}/>
          </Drawer>
          </div>
          <div className="chatList">
          <ChatList/>
          </div>
          
          </div>
          {(selectedchat)?<div>
          <div className="ChatHeader"><ChatHeader/></div>
          <div className="msgContainer" id="MsgCont">
        <MsgContainer/></div>
        <div className="inputMsg"><InputMessage/></div>
        </div>:<img src="images/background.jpg" style={{height:"80vh", width:"50vw", objectFit:"contain", opacity:"0.4",marginTop:"-5vh", marginLeft:"15vw"}}/>}
        </div>
    </div>
    )
  }
};

export default Home;
