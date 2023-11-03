import {useEffect} from "react";

//composants qui demande la confirmation avant un rafraîchissement ou changement de page
function Confirmation(){

    useEffect(() => {   
        window.addEventListener("beforeunload", AlertUser);
        return () =>{window.removeEventListener("beforeunload", AlertUser);}
    }, []);
    
    const AlertUser = e =>{
        e.preventDefault();
        e.returnValue = ''
    }
}

export default Confirmation;