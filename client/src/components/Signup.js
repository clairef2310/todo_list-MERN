import "bootstrap/dist/css/bootstrap.min.css";
import {Container, Form, Button} from "react-bootstrap";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";


//composant d'Accueil permettant d'avoir un tableau personnalisé récapitulant les formulaires crées par l'utilisateurs
function Signup() {
  
    const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });
  const { email, password, username } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const { data } = await axios.post(
            "http://localhost:3001/signup",
            {
            ...inputValue,
            },
            { withCredentials: true }
        );
        const { success, message } = data;
        if (success) {
            handleSuccess(message);
            setTimeout(() => {
            navigate("/");
            }, 1000);
        } else {
            handleError(message);
        }
        } catch (error) {
        console.log(error);
        }
        setInputValue({
        ...inputValue,
        email: "",
        password: "",
        username: "",
        });
    };
 
  return(
    <Container className="form_container">
      <h1>Créer un compte</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={email}  placeholder="Entrer votre email" onChange={handleOnChange}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUser">
          <Form.Label>Nom d'utilisateur</Form.Label>
          <Form.Control type="text" name="username" value={username} placeholder="Entrer votre nom d'utilisateur" onChange={handleOnChange}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control type="password" name="password" value={password} placeholder="Entrer votre mot de passe" onChange={handleOnChange}/>
        </Form.Group>
        <Button className="btn" type="submit">
          Valider
        </Button>
          <br/>
          <span>
            Already have an account? <Link to={"/login"}>Login</Link>  
          </span>
      </Form>
    </Container>    
  ) 
}

export default Signup;