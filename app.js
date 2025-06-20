const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
require('dotenv').config();

const app = express();

// MIDDLE-WARES
app.use(expressLayouts);
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(cookieParser('CookingBlogSecure'));
app.use(session({
    secret: 'CookingBlogSecertSession', 
    saveUninitialized: true,
    resave: true
}));
app.use(flash());
app.use(fileUpload());





app.set('layout', './layouts/main');
app.set('view engine', 'ejs')

const routes = require('./server/routes/recipeRoutes.js');
app.use('/', routes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Listening to port ${PORT}`));