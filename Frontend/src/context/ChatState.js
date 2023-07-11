import {useState,useEffect} from 'react'
import ChatContext from './ChatContext'
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;
socket = io(ENDPOINT);
const ChatState=(props)=>{
    const host="http://localhost:5000"
    const [user,setUser]=useState({});
    const [results,setResults]=useState([]);
    // const [searchuser,setSearchUser]=useState({});
    const [messages,setMessages]=useState([]);
    const [chats,setChats]=useState([]);
    const [selectedchat,setSelectedChat]=useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const audio=new Audio('sound1.mp3');
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        // eslint-disable-next-line
      }, []);
    const loginUser = async (credentials) => {  
        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
        });
        const json = await response.json()
        
        if (json.success){
            // Save the auth token and redirect
            // window.location.reload();
            localStorage.setItem('token', json.authtoken);
            const userDetails= await getUser("text");
            localStorage.setItem('user',JSON.stringify(userDetails))
            console.log("Hi",(JSON.parse(localStorage.getItem('user'))));
            
        }

        return json.success;
    }

    const RegisterUser = async (credentials) => {
        console.log("hello",credentials.pic);
        const response = await fetch(`${host}/api/auth/createuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: credentials.name,email: credentials.email, pic: credentials.pic,password: credentials.password})
        });
        const json = await response.json()
         if(json.success)
         {
            localStorage.setItem('token', json.authtoken);
            const userDetails= await getUser("text");
            localStorage.setItem('user',JSON.stringify(userDetails))
        }
      return json.success;   
    }

    const fetchAllChats=async()=>{
        const response = await fetch(`${host}/api/chat/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
        });
        const json = await response.json()
         setChats(json); 
    }
    const getUser=async(text)=>{
        console.log("hello",text)
        const response = await fetch(`${host}/api/auth/getuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
        });
        const json = await response.json()
        setUser(json);
        return json;
    }

    const searchUsers=async(text)=>{
        const response = await fetch(`${host}/api/auth/find?search=${text}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
        });
        const json = await response.json()
        setResults(json);
    }

    const accessChat=async(userid)=>{
        const response = await fetch(`${host}/api/chat/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({userId: userid})
        });
        const json = await response.json();
         setSelectedChat(json); 
        await fetchAllChats();
      await socket.emit("join chat", json._id);
    }
    const accessGroupChat=async(chat)=>{
        setSelectedChat(chat);
      await socket.emit("join chat", chat._id);

    }
    const createGroup=async(name,selectedUsers)=>{
        const response = await fetch(`${host}/api/chat/group`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({name:name,
                users:JSON.stringify(selectedUsers.map((u) => u._id))})
        });
        const json = await response.json();
         setSelectedChat(json);
         fetchAllChats();
    }
    const fetchMessages=async()=>{
        const response = await fetch(`${host}/api/message/${selectedchat._id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
        });
        const json = await response.json();
         setMessages(json);
    }
    const sendMessages=async(content)=>{
        const response = await fetch(`${host}/api/message/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({content:content,
                chatId:selectedchat._id})
        });
        const json = await response.json();
        socket.emit("new message", json);
        setMessages([...messages,json]);
    }

    useEffect(() => {
        if(selectedchat)
        fetchMessages();
    
        selectedChatCompare = selectedchat;
        // eslint-disable-next-line
      }, [selectedchat]);

      useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            // console.log('received');
          if (
            !selectedChatCompare || // if chat is not selected or doesn't match current chat
            selectedChatCompare._id !== newMessageRecieved.chat._id
          ) { 

          } else {
            setMessages([...messages, newMessageRecieved]);
            // console.log(newMessageRecieved.sender._id,JSON.parse(localStorage.getItem('user'))._id);
          }
        });
      });
      const grpRemove=async(id)=>{
        const response = await fetch(`${host}/api/chat/groupremove`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({chatId:selectedchat._id,
                userId:id})
        });
        const json = await response.json();
        setSelectedChat(json);
      }
      const addToGrp=async(id)=>{
        const response = await fetch(`${host}/api/chat/groupadd`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({chatId:selectedchat._id,
                userId:id})
        });
        const json = await response.json();
        setSelectedChat(json);
      }
    return (
        <ChatContext.Provider value={{fetchAllChats,chats,loginUser,RegisterUser,getUser,user,searchUsers,accessChat,results,selectedchat,createGroup,accessGroupChat,setSelectedChat,fetchMessages,messages,sendMessages,grpRemove,addToGrp}}>
            {props.children}
        </ChatContext.Provider>
      )
}
export default ChatState