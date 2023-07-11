import { Avatar,Box, Modal } from '@mui/material'
import React,{useContext,useState} from 'react'
import ChatContext from '../context/ChatContext';
import SearchUsers from './SearchUsers';
const ChatHeader = () => {
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
    const context=useContext(ChatContext);
    const {selectedchat,setSelectedChat,grpRemove}=context;
    const [open1,setOpen1]=useState(false);
    const [open2,setOpen2]=useState(false);
    const [open3,setOpen3]=useState(false);

    const getName=(Users)=>{
        if(JSON.parse(localStorage.getItem('user'))._id===Users[0]._id){
          return Users[1];
        }else{
          return Users[0];
        }
      }
      const handleClick=()=>{
        setSelectedChat(undefined);
      }
      const openModal=()=>{
        if(selectedchat.isGroupChat)
        setOpen1(!open1);
        else
        setOpen2(!open2);
      }
      const toggle2=()=>{
        setOpen3(!open3);
      }
      const show=(id)=>{
        let uid=JSON.parse(localStorage.getItem('user'))._id;
        let gadmin=selectedchat.groupAdmin._id;
        if(gadmin===uid && id!==gadmin)
        return true;
        else
        return false;
      }
      const remove=(id)=>{
        grpRemove(id);
      }
  return (
    <div className='chatHeadStyle'>
        <div style={{fontWeight:"bold",color:'white',border:"1px solid blue", padding:"5px"}} onClick={handleClick}>Back</div>
        <div style={{fontWeight:"bold",color:'white'}} >{(selectedchat.isGroupChat)?selectedchat.chatName:getName(selectedchat.users).name}</div>
        <div style={{}} onClick={openModal}>
        <Avatar alt={(selectedchat.isGroupChat)?selectedchat.chatName:getName(selectedchat.users).name} src={(selectedchat.isGroupChat)?'images/grpicon.jpg':getName(selectedchat.users).pic} />
        </div>
        <Modal
            open={open2}
            onClose={openModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
              <Box sx={style}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <img src={getName(selectedchat.users).pic} style={{height:"200px", borderRadius:"5%", objectFit:"contain"}}/>
                <h2>{getName(selectedchat.users).name}</h2>
                <h3>{getName(selectedchat.users).email}</h3>
                </div>
                </Box>
        </Modal>
        {(selectedchat.isGroupChat)?<Modal
            open={open1}
            onClose={openModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
              <Box sx={style}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <img src='images/grpicon.jpg' style={{height:"80px", width:"80px", borderRadius:"50%"}}/>
                <h2>{selectedchat.chatName}</h2>
                <h3>Participants</h3>
                <div className="addGrp" style={{margin:"auto"}}>
                    {selectedchat.users.map((user)=>(
                        <div className='detail'>
                            <div className='profileimg'>
                    <img src={user.pic}/>
                </div>
                <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
                  <div>{user.name}{(user._id===selectedchat.groupAdmin._id)?"  (Admin)":null}</div>
                  <div>{user.email}</div>
                  </div>
                  {show(user._id)?<button className='btn1' style={{height:"35px", marginTop:"15px"}} onClick={()=>remove(user._id)}>&#215;</button>:null}
                        </div>
                    ))}
                </div>
                <button className='btn1' onClick={toggle2}>Add Participants</button>
                <Modal
            open={open3}
            onClose={toggle2}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
              <Box sx={style}>
                <SearchUsers setOpen1={setOpen3} option={3}/>
                </Box>
            </Modal>
                </div>
                </Box>
        </Modal>:null}
    </div>
  )
}

export default ChatHeader