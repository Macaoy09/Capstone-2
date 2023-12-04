// Dependencies and Modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/user')
const productRoutes = require('./routes/product')

const port = 4004;

// This creates an "app" variable that stores the result to the "express" fucntion that initializes our express application and allows us access to different methods that will make backend creation easy
const app = express();

app.use(cors())
app.use(express.json())	
app.use(express.urlencoded({extended:true}));

mongoose.connect("Enter your database driver here", 
	{
		useNewUrlParser : true,
		useUnifiedTopology : true
});

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'))

app.use('/b4/users', userRoutes);
app.use('/b4/products', productRoutes);


if(require.main === module){
	app.listen(process.env.PORT || port, () => console.log(`Server is running at port ${ process.env.PORT || port}`))
}

module.exports = {app, mongoose};