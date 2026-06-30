const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// 1. Middleware อ่าน JSON + 2. Logger log ทุก request
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// 3. เชื่อม MySQL แบบมี Retry 3 ครั้ง
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'testdb'
});
let retries = 3;
function connectWithRetry() {
    db.connect(err => {
        if (err) {
            console.error('DB Error:', err.message);
            if (retries > 0) {
                retries--;
                console.log(`ลองเชื่อมใหม่... เหลือ ${retries} ครั้ง`);
                setTimeout(connectWithRetry, 2000);
            }
            return;
        }
        console.log('Connected to MySQL');
    });
}
connectWithRetry();

// 4. API POST /users เช็ค 400 กับ 500
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    // 400 Bad Request
    if (!name || !email) {
        return res.status(400).json({ error: '400 Bad Request', message: 'ต้องมี name และ email' });
    }
    db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
        // 500 Internal Server Error
        if (err) {
            console.error(err);
            return res.status(500).json({ error: '500 Internal Server Error' });
        }
        res.status(201).json({ id: result.insertId, name, email });
    });
});

// 5. 404 Not Found สำหรับ API ที่ไม่มี
app.use((req, res) => {
    res.status(404).json({ error: '404 Not Found', message: 'หา API นี้ไม่เจอ' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});