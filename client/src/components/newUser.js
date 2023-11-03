import {useState, React} from 'react';
import {useNavigate} from 'react-router-dom';
import {Form,Container,InputGroup,FormControl} from "react-bootstrap"
import {BadCharac, InputVide} from './regex'
import Icon from '@mdi/react';
import { mdiEyeOutline } from '@mdi/js';
import CustomAxios from '../interceptor';
import Confirmation from './confirmation';


//composant qui permet la création d'un utilisateur
function NewUser() {

    //constante pour la gestion d'erreur
    const [errorN, setErrorN] = useState('');
    const [errorP, setErrorP] = useState('');
    const [errorE, setErrorE] = useState('');
    const [errorPwd, setErrorPwd] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);
    let Globalerror = false
    let Vide = false

    //constante pour la navigation
    let navigate = useNavigate();

    //constantes du formulaire
    const [nomUT, setNomUT] = useState('');
    const [prenomUT, setPrenomUT] = useState('');
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');

    //fonction qui affiche en texte le mot de passe
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    //fonction qui s'assure que certains caractères ne sont pas présent
    async function nobaditem(){
        let tab = []
        let error= []
        tab[0]=email.toString()
        tab[1]=pwd.toString()
        tab[2]=nomUT.toString()
        tab[3]=prenomUT.toString()
        for(let i=0;i<tab.length;i++){
        error[i] =(BadCharac.test(tab[i]))
        if (error[i]===true) Globalerror = true
        }
        if (error[0]) setErrorE("Les caractères $, { et } ne sont pas autorisés")
        if (error[1]) setErrorPwd("Les caractères $, { et } ne sont pas autorisés")
        if (error[2]) setErrorN("Les caractères $, { et } ne sont pas autorisés")
        if (error[3]) setErrorP("Les caractères $, { et } ne sont pas autorisés")
    }

    //fonction qui permet de vérifier que les input ne sont pas vides
    async function inputVide(){
        let tab = []
        let error= []
        tab[0]=email
        tab[1]=nomUT
        tab[2]=prenomUT
        tab[3]=pwd
        for(let i=0;i<tab.length;i++){
        error[i] =(!InputVide.test(tab[i]))
        if (error[i]===true) Vide  = true
        }
        if (error[0]) setErrorE("L'email doit être renseigné et doit contenir plus de 3 caractères")
        if (error[1]) setErrorN("Le nom doit être renseigné et doit contenir plus de 3 caractères")
        if (error[2]) setErrorP("Le prénom doit être renseigné et doit contenir plus de 3 caractères")
        if (error[3]) setErrorPwd("Le mot de passe doit être renseigné et doit contenir plus de 3 caractères")
        return Vide 
    }

    //fonction appelée à la validation de l'utilisateur
    async function transportdata(event){

        setErrorN("")
        setErrorP("")
        setErrorE("")
        setErrorPwd("")
        event.preventDefault();
        
        //vérification des données saisies
        if(await inputVide() === false){
            await nobaditem().then(()=>{
                if (!Globalerror){
                    const dataform = {
                        nomUT: nomUT,
                        prenomUT: prenomUT,
                        email: email,
                        pwd: pwd,
                    }
                    CustomAxios.post(process.env.REACT_APP_PATH_ADD_USER, dataform
                    ).then((res)=>
                    {
                    alert("L'utilisateur a bien été créé")
                        navigate("/todo", { replace: true });
                        return res;
                    })
                }else{
                    alert("Des symboles interdit ont été saisis")
                }
            })
        }else{ 
            alert("Tous les champs doivent être renseignés")
        }
    };

    //formulaire de création d'utilisateur
    return (
      <div>
        <Confirmation/>
            <Container className="d-flex justify-content-center align-items-center">
                  <Form responsive='true' className="rounded p-4 p-sm-6 ">
                    <h1 className="text-center p-3">Création d'un nouvel utilisateur</h1>
                    <br/>
            {/*-----------------------------------------------------------------------------------------------------------------------------------------------------------*/} 
                      <Form.Group className="text-center mb-4">
                        <Form.Label  > 
                          Nom :
                          <Form.Control className=" mt-3" required name="nomUT" type="text" value={nomUT} onChange={e => setNomUT(e.target.value)}  /> 
                          {(errorN !=="") ? (<div className="error">{errorN}</div> ) :"" }
                          </Form.Label>
                      </Form.Group>

                      <Form.Group className="text-center mb-4">
                        <Form.Label className="text-center">
                          Prenom :
                          <Form.Control className=" mt-3" required name="prenomUT" type="text" value={prenomUT} onChange={e => setPrenomUT(e.target.value)}  />
                          {(errorP !=="") ? (<div className="error">{errorP}</div> ) :"" }
                        </Form.Label>
                      </Form.Group>

                      <Form.Group className="text-center mb-4">
                        <Form.Label className="text-center">
                          Email :
                          <Form.Control className=" mt-3"  required name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                          {(errorE !=="") ? (<div className="error">{errorE}</div> ) :"" }
                        </Form.Label>
                      </Form.Group>

                      <Form.Group className="text-center mb-4">
                        <Form.Label>
                          Mot de passe : 
                          <InputGroup className="mb-3">
                            <FormControl type={passwordShown ? "text" : "password"} required name="pwd" value={pwd} onChange={e => setPwd(e.target.value)} />
                            <button className='btn btnSecondary' onClick={togglePassword}><Icon path={mdiEyeOutline} size={1} /></button>  
                           </InputGroup>
                           {(errorPwd !=="") ? (<div className="error">{errorPwd}</div> ) :"" }
                        </Form.Label>        
                      </Form.Group>
              {/*-----------------------------------------------------------------------------------------------------------------------------------------------------------*/}  

                    <Container className="text-center">       
                        <button className='btn btnPrimary btn-sm text-align-center btnPrimary' onClick={transportdata}> Valider</button>
                    </Container>
                  </Form>
                </Container>
      </div> 
    );
}
    
export default NewUser;