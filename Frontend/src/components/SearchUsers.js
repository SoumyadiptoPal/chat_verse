import React,{useContext,useEffect,useState} from 'react'

import ChatContext from '../context/ChatContext';


const SearchUsers = ({setOpen1,option,setParticipants,participants}) => {
    const context=useContext(ChatContext);
    const [stext,setStext]=useState("");

    const {searchUsers,results,selectedchat,accessChat,addToGrp}=context;
    useEffect(()=>{
        searchUsers(stext);
      },[])
    const handleE=(user)=>{
        console.log("selected");
        if(option===1){
            accessChat(user._id);
        setOpen1(false)
        }
        else if(option===2)
        {
            // setParticipants(prevParticipants => [...prevParticipants, user]);
            let flag=true;
            participants.map((ouser)=>{
              if(user._id===ouser._id)
              flag=false;
          })
          if(flag)
          setParticipants(prevParticipants => [...prevParticipants, user]);
            setOpen1(false);
            console.log("hi",user)
        }
        else
        {
          const isPresent = selectedchat.users.some(obj =>
            obj._id === user._id 
          );
          if(!isPresent)
          addToGrp(user._id);
          setOpen1(false);
        }
        
      }
      const onChange=(e)=>{
        setStext([e.target.name=e.target.value]);
        
      }
      const handleSubmit=()=>{
        searchUsers(stext);
      }
    return (
        <div style={{width:"30vw"}}>
            <input type="text" className="search" value={stext} onChange={onChange} id="search" name="search" placeholder='Search User....'/><button onClick={handleSubmit} className='btn1'>Search</button>
            {results.map((User)=>
            {
                return(<div className="profileItem" onClick={()=>handleE(User)}
                // style={(selectedChat===Chat)?{backgroundColor:"skyblue"}:{}}
                >
                    <div className='profileimg'>
                        <img src='images/profile.jpg'/>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
                      <div>{User.name}</div>
                      <div>{User.email}</div>
                      </div>
                </div>
                )
            })}
        </div>
      )
}

export default SearchUsers