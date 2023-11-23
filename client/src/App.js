import {React} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './style.css'
import Todo from './components/Todo'; 
import Login from './components/Login';
import Home from './components/Home';
import Signup from './components/Signup';

function App() { 
      
    return ( 
        <div> 
            <BrowserRouter >
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/signup' element={<Signup/>}/>
                    <Route path='/todo' element={<Todo/>}/>
                </Routes>
            </BrowserRouter>
        </div> 
    ); 
} 

export default App;
