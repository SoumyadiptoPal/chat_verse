import React, {useState,useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "../stylesheets/Login.css"
import ChatContext from '../context/ChatContext';

const Login = () => {
    const [credentials, setCredentials] = useState({email: "", password: ""}) 
    const context=useContext(ChatContext);
    const { loginUser } = context;
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        let success=await loginUser(credentials);
        if (success){
            navigate('/home');
        }
        else{
            console.log("ERROR:Invalid Credentials","danger")
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
            <h3 id="header">Login</h3>
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
            <form  onSubmit={handleSubmit} id="forms">
                <div className="elements">
                    <label htmlFor="email" className="form-label">Email address </label>
                    <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name="email" aria-describedby="emailHelp" />
                </div>
                <div className="elements">
                    <label htmlFor="password" className="form-label">Password &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                    <input type="password" className="form-control" value={credentials.password} onChange={onChange} name="password" id="password" />
                </div>

                <button type="submit" className="button">Login</button>
            </form>
        </div>
</div>
    )
}

export default Login
