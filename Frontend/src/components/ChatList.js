import React, {useContext,useEffect} from 'react'
import '../stylesheets/ChatList.css'
import ChatContext from '../context/ChatContext';

const ChatList = () => {
  const context=useContext(ChatContext);
  const {accessChat,selectedchat,accessGroupChat,chats,fetchAllChats}=context
  useEffect(() => {
    fetchAllChats();
  }, [])
  const handleE=(chat)=>{
    if(chat.isGroupChat){
      accessGroupChat(chat)
    }else{
      accessChat(getName(chat.users)._id);
    }
  }
  const getName=(Users)=>{
    if(JSON.parse(localStorage.getItem('user'))._id===Users[0]._id){
      if(Users[1])
      return Users[1];
    }else{
      return Users[0];
    }
  }
  function removeHTMLTags(htmlString) {
    var text=htmlString.replace(/<[^>]+>/g, '');
    if(text.length>25)
    {
      text=text.slice(0,25)+"..."
    }
    return text;
  }
  return (
    <div>
        {chats && chats.map((Chat)=>
        {
          if(Chat.users.length>=2)
            return(<div className="profileItem" key={Chat._id} onClick={()=>handleE(Chat)}
            style={(selectedchat && selectedchat._id===Chat._id)?{backgroundColor:"skyblue"}:{}}>
                <div className='profileimg'>
                    <img src={(Chat.isGroupChat)?'images/grpicon.jpg':getName(Chat.users).pic}/>
                </div>
                <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
                  <div>{(Chat.isGroupChat)?Chat.chatName:getName(Chat.users).name}</div>
                  <div>{(Chat.latestMessage) && removeHTMLTags(Chat.latestMessage.content)}</div>
                  </div>
            </div>
            )
        })}
    </div>
  )
}

export default ChatList