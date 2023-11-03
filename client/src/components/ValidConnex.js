import {React, useEffect, useState,useContext} from "react";
import { Navigate } from "react-router-dom";
import {validPassword} from "./regex"
import {AuthContext} from '../context';
import CustomAxios from "../interceptor";
import Connexion from "./connexion";
import axios from "axios";

//composant qui va vérifier la connexion et l'authentification
function ValideConnex() {

const [error, setError] = useState(""); 
const {value,valeur}=useContext(AuthContext)
const {isAuth,setIsAuth} = value
const {role,setRole} = valeur

//fonction lancée à chaque chargement de ce composant
useEffect(()=>{AlreadyLogged() },[])

/*fonction permettant de vérifie si l'utilisateur n'a pas déjà un accès à l'application
(avec le cookie contenant le refresh token)*/
async function AlreadyLogged(){
    CustomAxios.get(process.env.REACT_APP_PATH_LOGGED,{withCredentials: true}).then((res)=>{
        if (res.data.authen === true ){ 
            sessionStorage.setItem('isAuth',true)
            setIsAuth(Boolean(sessionStorage.getItem('isAuth')))
        } 
        else{
            localStorage.clear()
            sessionStorage.clear() 
        }
    })
}

  
//fonction permettant de se login (database only)
const Login = details => {

    if(!validPassword.test(details.password)=== false){
        setError("le mot de passe doit une majuscule, une minuscule, un chiffre, un caractère spécial (-,+,!,*,@,%,_) et doit contenir au minimum 8 caractères")
    }else{
        axios.get(process.env.REACT_APP_PATH_LOGIN,{withCredentials: true,params: {pwd: details.password,email: details.email}})
        .then((res)=>{
        const id=res.data.id
        const token=res.data.AccessToken
        localStorage.setItem('token',token)
        localStorage.setItem('id',JSON.stringify(id))
        sessionStorage.setItem('isAuth',true)
        setRole(localStorage.getItem('id_role'))
        setIsAuth(Boolean(sessionStorage.getItem('isAuth')))
        })  
        .catch((err)=>{
            setError(err)
        })
    }
}

    return(
      <div>
        {/*Si authentifié, l'utilisateur est dirigé vers l'accueil */}
        {(isAuth) ? (
          <div>
            <Navigate to='/todo'/>
          </div>
        ) : (
          <Connexion Login={Login} error={error}/>
        )}
      </div> 
    )
}

export default ValideConnex;