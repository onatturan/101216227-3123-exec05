const fs = require('fs');  // fs module to handle file system operations
const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();

// Add middleware to handle incoming JSON data
app.use(express.json()); 

// Home Route: Return home.html page to client
router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));  // Return home.html file to the client
});

// Profile Route: Return all details from user.json file to client as JSON format
router.get('/profile', (req, res) => {
    // Read user.json file and send its contents as JSON response
    fs.readFile('user.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading user data');
        } else {
            res.json(JSON.parse(data));  // Return JSON data from user.json
        }
    });
});

/*
- Modify /login router to accept username and password as JSON body parameters
- Read data from user.json file
- If username and password are valid, send response:
    {
        status: true,
        message: "User is valid"
    }
- If username is invalid, send response:
    {
        status: false,
        message: "User Name is invalid"
    }
- If password is invalid, send response:
    {
        status: false,
        message: "Password is invalid"
    }
*/
router.post('/login', (req, res) => {
    const { username, password } = req.body;  // Destructure username and password from the request body
    fs.readFile('user.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading user data');
        }
        const userData = JSON.parse(data);
        // Check username and password
        if (username === userData.username) {
            if (password === userData.password) {
                res.json({ status: true, message: "User is valid" });
            } else {
                res.json({ status: false, message: "Password is invalid" });
            }
        } else {
            res.json({ status: false, message: "User Name is invalid" });
        }
    });
});

/*
- Modify /logout route to accept username as a parameter and display message
    in HTML format like <b>${username} successfully logout.</b>
*/
router.get('/logout/:username', (req, res) => {
    const { username } = req.params;
    res.send(`<b>${username} successfully logged out.</b>`);  // Return logout message in HTML format
});

// Add error handling middleware to return 500 page with the message "Server Error"
app.use((err, req, res, next) => {
    res.status(500).send('Server Error');  // Return 500 error message
});

app.use('/', router);

app.listen(process.env.port || 8081, () => {
    console.log('Web Server is listening at port ' + (process.env.port || 8081));
});
