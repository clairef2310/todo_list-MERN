const newUser = require('./models/newUser')
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require("mongoose");
const routes = require('./routes')
bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const app = express()
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const {body,validationResult} = require ('express-validator')

const connectToMongoDB = async () => {
    await mongoose.connect(process.env.MONGODB);
};
  
(async () => {
    await connectToMongoDB();
})();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({credentials: true, origin: process.env.CORS}))
app.use(express.json())
app.use(cookieParser())
app.use('/app', routes)

//fonction de login
app.get('/login', 
    body('pwd').blacklist('{}$'),
    body("email").blacklist('{}$*/:!?;,=+&()<>%$€'),
 (req,res) =>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.sendStatus(400)
        }else{
            //regarde si l'email existe dans la base de donnée
                newUser.find({email: req.query.email.trim()},function(err,doc){
                    if (doc.length === 0) {
                    res.status(404).json({message:"Email incorrect"})
                    }
                    else if(err){
                        console.log(err)
                    }
                    else {
                    // compare en hachant le mot de passe saisie pour le comparer à la base de données
                    const bool =bcrypt.compareSync(req.query.pwd.trim(),doc[0].pwd)
                    // si c'est bon alors : 
                        if (bool){
                            // id de l'utilisateur
                            const id = doc[0].id_formu
                            const id_role= doc[0].id_role
                            const AccessToken = jwt.sign({ id: id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 60} )
                            const refreshToken = jwt.sign({ id: id}, process.env.ACCES_REFRESH_TOKEN, {expiresIn: 43200})
                            res
                            .cookie('rtoken',refreshToken,{httpOnly: true,sameSite: "none", secure: true})
                            //le token est bien été envoyé (id et id role)
                            .status(202).json({AccessToken: AccessToken,id: id,id_role: id_role})}
                        else{
                            res.status(400).json({message:"Mot de passe incorrect"})
                        }
                    
                    }
                })
        }   
})

//fonction qui permet d'obtenir un token d'accès si on est connecté et que l'ancien est expiré
app.get('/token',(req,res) =>{
    const rtoken = req.cookies.rtoken
    if (rtoken == null) return res.sendStatus(405)
    jwt.verify(rtoken, process.env.ACCES_REFRESH_TOKEN, (err,user) =>{
        if (err) return res.sendStatus(405)
        const id=user.id
        const AccessToken= jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 15})
        res
        .status(202).json({AccessToken: AccessToken,id: id})
    })
})

//permet au chargement de la page de login, de savoir si l'utilisateur est déjà connecté
app.get('/logged',(req,res)=>{
    const rtoken = req.cookies.rtoken
    if (rtoken == null) return res.sendStatus(405)
    jwt.verify(rtoken, process.env.ACCES_REFRESH_TOKEN, (err,user) =>{
        if (err) return res.sendStatus(405)
        res
        .status(202).json({authen: true})
    })
})

//permet de déconnecter l'utilisateur
app.get('/logout',(req,res)=>{
    res
    .status(202)
    .cookie('token',null,{httpOnly: true,secure: true,expires: new Date(0)})
    .cookie('rtoken',null,{httpOnly: true, secure: true,expires: new Date(0)}).send('done')
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))