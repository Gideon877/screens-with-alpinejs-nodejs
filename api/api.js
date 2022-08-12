const auth = require("./middleware/auth");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
module.exports = async (app, db) => {

    const data = [
        { id: 1, price: 75.99, type: '3D printing', amount: 5, clothing: 'Jackets' },
        { id: 2, price: 58.99, type: '3D printing', amount: 5, clothing: 'Hoodies' },
        { id: 3, price: 34.99, type: '2D printing', amount: 5, clothing: 'T-Shirts' },
    ]

    // API routes

    app.post('/api/login', async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await db.oneOrNone(`select * from users where username = $1`, [username]);

            if (!user) {
                throw new Error(`User with username:${username} is not found`);
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw new Error('Password is incorrect!');
            }
            const token = jwt.sign(user, 'secret', { expiresIn: '5h' });

            res.status(200).json({
                token,
                user: {
                    ...user,
                    firstName: user.first_name,
                    lastName: user.last_name,
                }
            })
        } catch (error) {
            console.error(error)
            res.status(501).json({ error: error.message })
        }
    });


    app.post('/api/signup', async (req, res) => {
        try {
            const { username, password, firstName, lastName } = req.body;
            const existingUser = await db.oneOrNone(`select * from users where username = $1`, [username]);
            if (existingUser !== null) {
                throw new Error('A user with the same username already exists. Specify another username.')
            }
            const hashedPassword = await bcrypt.hash(password, 16);

            await db.none(`insert into users (username, password, first_name, last_name) values($1, $2, $3, $4)`, [username, hashedPassword, firstName, lastName]);
            res.status(200).json({ data: {} });

        } catch (error) {
            console.log(error);
            res.status(501).json({
                status: 'failed',
                error: error.stack
            })
        }
    })


    app.get('/api/products', async (req, res) => {
        res.status(200).json({
            data
        });
    });

    app.get('/api/products/:id', async (req, res) => {

        if (req.params.id < 1 && req.params.id > 3) {
            res.status(200).json()
        } else {
            res.status(200).json({
                data: data.filter(product => product.id == req.params.id)
            });
        }


    });

    app.get('/api/authenticate', auth, async (req, res) => 
        res
            .status(200)
            .json({ status: 'Token Authentication Success', user: req.user })
    );



}