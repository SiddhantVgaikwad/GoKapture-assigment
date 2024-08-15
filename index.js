const express = require('express');
const  app = express();
require('dotenv').config();
const port = process.env.PORT;
//const flash = require('connect-flash');
const authRoutes = require('./routes/auth'); 
const taskRoutes = require('./routes/task'); 




// Middleware to parse incoming JSON requests
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', taskRoutes);

// //Flash messages setup
// app.use(flash());
// app.use(function(req, res, next) {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.error = req.flash('error');
//   next();
// });


require('./config/mongoDB')
app.listen(port, 
    console.log(`server is running ${port}`)
)