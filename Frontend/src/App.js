import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import  Home  from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import ChatState from './context/ChatState';

function App() {
  return (
      <ChatState>
        <Router>
          <div>
          <div>
            <Routes>
            <Route path="/" element={<Login />}/>
            <Route path="/home" element={<Home />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<Signup />}/>
            </Routes>
          </div>
          </div>
        </Router>
        </ChatState>
  );
}

export default App;
