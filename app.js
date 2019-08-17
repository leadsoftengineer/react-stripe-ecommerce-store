/**
 * smolynx2019@hotmail.com
 */

const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey); //sk-secret key from stripe
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

//Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

//Set Static Folder
app.use(express.static(`${__dirname}/public`));

//Index route
app.get('/', (req, res) => {
    res.render('index', {
        stripePublishableKey: keys.stripePublishableKey
    });
})
//Success route
app.get('/success', (req, res) => {
    res.render('success');
})

//Charge route 
app.post('/charge', (req, res) => {
    const amount = 40000;
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
        .then(customer => stripe.charges.create({
            amount,
            descripotion: 'E-commerce development',
            currency: 'usd',
            customer: customer.id
        }))
        .then(charge => res.render('success'))
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);

});

