import React, {useState,useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ChatContext from '../context/ChatContext';
import { storage } from "./firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Signup = () => {
    const [credentials, setCredentials] = useState({name:"",email: "", password: "", pic:""});
    const [file,setFile]=useState(null);
    const navigate = useNavigate();
    const context=useContext(ChatContext);
    const { RegisterUser } = context;
    const [progress,setProgress]=useState(0);
    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(credentials);
        const success=await RegisterUser(credentials);
         if(success)
         {
            navigate('/home');
         }
         else
         {
            console.log("User with this email-id already exists","danger")
         }
    }

    const handleUpload = async(e) => {
        e.preventDefault();
        // console.log(file.name);

        const storageRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(prog);
          },
          (error) => {
            console.log(error.message);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              credentials.pic=downloadURL;
            //   console.log(credentials.pic);
              setProgress(0);
              handleSubmit(e);
            });
          }
        );
      };

      const fileChange = (e) => {
        if (e.target.files[0]) {
          setFile(e.target.files[0]);
        }
    }

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    return (
        <div className='cont1'>
            <div className='cont3'>
                <img src='images/background.jpg'/>
            </div>
        <div className='cont2'>
            <div style={{display:"flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"}}>
        <h3 id="header">Sign up</h3>
            <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
            <form>
                <div className="elements">
                    <label htmlFor="name" className="form-label">Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                    <input type="text" className="form-control" value={credentials.name} onChange={onChange} id="name" name="name" />
                </div>
                <div className="elements">
                    <label htmlFor="email" className="form-label">Email address </label>
                    <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name="email" aria-describedby="emailHelp" />
                </div>
                <div className="elements">
                    <label htmlFor="password" className="form-label">Password &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                    <input type="password" className="form-control" value={credentials.password} onChange={onChange} name="password" id="password" />
                </div>
                <div className="elements">
                    <label htmlFor="file" className="form-label">Profile Picture&nbsp;&nbsp;</label>
                    <input type="file" onChange={fileChange}/>
                    {progress > 0 && <progress value={progress} max="100" />}
                </div>
                <div style={{display:"flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"}}>
                <button type="submit" className="button" onClick={handleUpload}>Create Account</button>
                </div>
            </form>
        </div>
        </div>
    )
}

export default Signup
