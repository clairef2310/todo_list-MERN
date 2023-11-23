import "bootstrap/dist/css/bootstrap.min.css";
import {Container,Button} from "react-bootstrap";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Todo from "./Todo"

//composant d'Accueil permettant d'avoir un tableau personnalisé récapitulant les formulaires crées par l'utilisateurs
function Home() {

  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  
  const username = useMemo(() => {
    return cookies.token ? cookies.username || "" : "";
  }, [cookies]);

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      } else {
        const { data } = await axios.post(
          "http://localhost:3001",
          {},
          { withCredentials: true }
        );
        const { status, user } = data;
        if (status) {
          toast(`Hello ${user}`, {
            position: "top-right",
          });
        } else {
          removeCookie("token");
          navigate("/login");
        }
      }
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const Logout = () => {
    removeCookie("token");
    navigate("/login");
  };
 
  return(
    <Container className="home_page">
        <h4>Bienvenue <span>{username}</span></h4>
        <Button onClick={Logout}>Deconnexion</Button>
      <Todo />
    </Container>
  ) 
}

export default Home;




