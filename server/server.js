const express = require('express') 
const mongoose = require('mongoose') 
const cors = require('cors') 
const app = express(); 
const memoryCache = require('memory-cache');
require("dotenv").config();
const { MONGODB, PORT } = process.env;
const cookieParser = require("cookie-parser");
const Route = require("./routes/Route");



// Connect to your MongoDB database (replace with your database URL) 
mongoose.connect(MONGODB)
.then(() => console.log("MongoDB is  connected successfully"))
.catch((err) => console.error(err));


app.use(
	cors({
	  origin: ["http://localhost:3000"],
	  methods: ["GET", "POST", "PUT", "DELETE"],
	  credentials: true,
	})
);

app.use(cookieParser());

app.use(express.json()); 

// Middleware de mise en cache
const cache = (duration) => {
	return (req, res, next) => {
	  const key = '__express__' + req.originalUrl || req.url;
	  const cachedBody = memoryCache.get(key);
	  if (cachedBody) {
		res.send(cachedBody);
		return;
	  } else {
		res.sendResponse = res.send;
		res.send = (body) => {
		  memoryCache.put(key, body, duration * 1000);
		  res.sendResponse(body);
		};
		next();
	  }
	};
  };

app.use("/", Route);

app.listen(PORT, () => { 
	console.log('Server running on 3001'); 
}); 

module.exports = app;