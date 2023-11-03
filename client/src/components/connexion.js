import {useState} from "react";
import {Form, Container,InputGroup,FormControl} from "react-bootstrap"
import Icon from '@mdi/react';
import { mdiEyeOutline } from '@mdi/js';


//composant collectant les données nécessaire et la connexion et les envoyant
function Connexion({Login,error}) {

    const [details, setDetails] = useState({email:"", password:""});
    const [passwordShown, setPasswordShown] = useState(false);


    //fonction qui affiche en texte le mot de passe
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    const submitHandler = e => {
        e.preventDefault();
        Login(details);
    }

    return(         
            <Form onSubmit={submitHandler} className="rounded p-4 p-sm-6 vertical-center connexion">
                <h1 className="text-center p-3" id="connTitre">Connexion</h1>    
                <div id="passGroup">   
                        <Form.Group className="mb-4">
                            <Form.Label >
                                Email :
                            </Form.Label>
                                <Form.Control type="email" placeholder="Saissisez votre email" name="email" onChange={e => setDetails({...details, email: e.target.value})}  value={details.email} className="label"  id="emailIn"/>
                        </Form.Group>

                        {(error !=="") ? (<div className="error">{error}</div> ) :"" }
                        <br/>

                        <Form.Group className="text-center mb-4">
                            <Form.Label >
                                Mot de Passe:
                            </Form.Label> 
                            <Container className="d-flex justify-content-center align-items-center">
                            <InputGroup className="mb- w-75">
                                    <FormControl type={passwordShown ? "text" : "password"} placeholder="Saissisez votre mot de passe" name="password" onChange={e => setDetails({...details, password: e.target.value})}  value={details.password} className="w-25" />
                                    <button onClick={togglePassword} className="btn w-0 btnPrimary" ><Icon path={mdiEyeOutline} size={1} /></button>  
                                </InputGroup> 
                            </Container>
                        </Form.Group>
                        </div>   
                    <button className="btn btnPrimary" type="submit" >Valider</button>
                    <button className="btn btnSecondary" type="submit" >S'inscrire</button>
            </Form>
    )
}

export default Connexion;