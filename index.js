const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('welcome to express express app');
});

app.get('/about', (req, res) => {
    res.send('this is an express app');
});

app.get('/user/:name', (req, res) => {
    res.send(`hello, ${req.params.name}`);
});

app.post('/user', (req, res) => {
    res.send(`user ${req.body.name} created`);
});

app.listen(port, () => {
    console.log(`server กำลังรันที่ http://localhost:${port}`);
});