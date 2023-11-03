import axios from 'axios';

const CustomAxios=axios.create({})

//fonction permettant d'insérer à l'envoie de la requête le token dans l'en-tête afin de s'authentifier avec l'api
CustomAxios.interceptors.request.use(req=>{
    req.headers['x-access-token']=localStorage.getItem('token');
        return req;},
        err=>{return Promise.reject(err)}
)

/*fonction permettant à la de gérer la réception d'une erreur ou d'une réponse
 elle transet la réponse si elle existe
 ou si l'erreur interceptée est de type 401 (mauvais token d'identifications), tentative d'en récupérer un nouveau à l'aide du refresh token*/
CustomAxios.interceptors.response.use(
    res=>{return res;},
    err=>{
        const originalReq=err.config;
        const status= err.response ? err.response.status : null; 
        if(status===401 )
        {
            return axios.get(process.env.REACT_APP_TOKEN,{withCredentials: true}).then((res)=>{
            const token = res.data.AccessToken
            const id = res.data.id
            localStorage.setItem('token',token)
            localStorage.setItem('id',JSON.stringify(id))
            return CustomAxios(originalReq);
            })
            .catch((err)=>{
                console.log(err)});
        }
        else if(status===405){ 
            return "not connected"
        }
        return Promise.resolve(err)
    }
)

export default CustomAxios;