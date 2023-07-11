import React, { useContext, useState } from 'react'
import SearchUsers from './SearchUsers';
import { Modal,Box,Avatar } from '@mui/material';
import ChatContext from '../context/ChatContext';


const Groups = () => {
  const context=useContext(ChatContext);
  const {createGroup}=context;
    const [open1,setOpen1]=useState();
    const [open2,setOpen2]=useState();
    const [participants,setParticipants]=useState([]);
    const [name,setName]=useState([]);
  const handleClose1 = () => setOpen1(!open1);
  const toggle = () => setOpen2(!open2);
  const onChange=(e)=>{
    setName([e.target.name]=e.target.value);
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
    const handleAdd=()=>
    {
        handleClose1();
        toggle();
    }
    const handleSubmit=(e)=>{
      e.preventDefault();
      createGroup(name,participants);
    }
    const remove=(userId)=>{
      const newArray = participants.filter(obj => obj._id !== userId);
      setParticipants(newArray);
    }
  return (
    <div><h2>Create a group Chat</h2>
    <input type="text" className="search" value={name} onChange={onChange} id="search" name="search" placeholder='Enter Group Name....'/>
    <div>Add Participants</div>
    {participants.map((User)=>(
      <div className='addgrp' style={{display:"flex"}}>
        <div className='detail' style={{margin:"5px"}}><Avatar alt={User.name} src={User.pic} sx={{ width: 24, height: 24 }}/>{User.name}<button onClick={()=>remove(User._id)}>&#215;</button></div>
      </div>
    ))}
    <button className='btn1'
    onClick={handleAdd}
    >Add</button>
    <Modal
            open={open2}
            onClose={toggle}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
              <Box sx={style}>
                <SearchUsers setOpen1={setOpen2} option={2} setParticipants={setParticipants} participants={participants}/>
                </Box>
            </Modal>
    <button className='btn1' onClick={handleSubmit}>Create</button>
    </div>
  )
}

export default Groups