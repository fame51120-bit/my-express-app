const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Middleware 1: Log Method + URL
app.use((req, res, next) => {
    console.log(`Method: ${req.method}, URL: ${req.url}`);
    next();
});

// Middleware 2: ตรวจ name เฉพาะ POST /user
const validateName = (req, res, next) => {
    if (req.method === 'POST' && req.path === '/user' && !req.body.name) {
        return res.status(400).json({ error: 'กรุณาระบุ name' });
    }
    next();
};
app.use(validateName);

// Routes เดิม
app.get('/', (req, res) => res.send('Welcome to Express'));
app.get('/about', (req, res) => res.send('This is an Express app'));
app.get('/user/:name', (req, res) => res.send(`Hello, ${req.params.name}`));
app.post('/user', (req, res) => res.send(`User ${req.body.name} created`));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});