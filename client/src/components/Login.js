import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useMemo } from "react";
import {Container,Form, Button, Row, Col} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

//composant d'Accueil permettant d'avoir un tableau personnalisé récapitulant les formulaires crées par l'utilisateurs
function Login() {
  
  const navigate = useNavigate();
  
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const derivedValues = useMemo(() => {
    const someDerivedValue = email + "_derived";
    return {
      derivedValue: someDerivedValue,
    };
  }, [email]);


  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3001/login",
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      console.log(data);
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
    });
  };

 
  return(
    <Container className="form_container">
      <h1>Se connecter</h1>
      <Form onSubmit={handleSubmit} className="mt-3">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={email}  placeholder="Entrer votre email" onChange={handleOnChange}/>
       </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control type="password" name="password" value={password} placeholder="Entrer votre mot de passe" onChange={handleOnChange}/>
        </Form.Group>

        <Row>
          <Col className="d-flex justify-content-center">
            <Button className="btn mb-2 d-flex justify-content-center" type="submit">
              Valider
            </Button>
          </Col>
        </Row>
        
        <br/>
        <span className="text-center">
          Vous n'avez pas encore de compte ? <Link to={"/signup"}> <br/>Se créer un compte</Link>
        </span>
      </Form>
    </Container>
  ) 
}

export default Login;