import {React} from 'react';
import { Router, Routes, Route } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './style.css'
import Todo from './components/Todo'; 
import ValideConnex from './components/ValidConnex'
import NewUser from './components/newUser';

function App() { 
      
    return ( 
        <div> 
            <h1 className='headerStyle'>Todo List</h1> 
            <Router> 
                <Routes> 
                    <Route  path='/' element={<ValideConnex/>} />
                    <Route path='/todo' element={<Todo/>}></Route> 
                    <Route path='/newUser' element={<NewUser/>}></Route> 
                </Routes> 
            </Router> 
        </div> 
    ); 
} 

export default App;
