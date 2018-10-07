const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');
const bodyParser = require('body-parser');

if (process.env.NODE_ENV === 'test'); {
    dotenv.config();
}

const port = `${process.env.PORT}`;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log('request query string params -> ', req.query);
    console.log('request headers:  -> ', req.headers);
    console.log('request body: ->', req.body);
    
    var transporter = nodemailer.createTransport({
        service: `${process.env.EMAIL_SERVICE_PROVIDER}`,
        auth: {
            user: `${process.env.SENDER_EMAIL}`,
            pass: `${process.env.SENDER_PASSWORD}`
        }
    });

    var mailOptions = {
        from: `${process.env.SENDER_EMAIL}`,
        to: `${process.env.RECEIVER_EMAIL}`,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!',
        attachments: [
            {
                filename: 'data.txt',
                content: fs.createReadStream('./data.txt')
            }
        ]
    };

    // got to this url 'https://myaccount.google.com/lesssecureapps' to chenge the following setting:
    // Allow less secure apps: ON
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    res.send('Checke you gmail inbox');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

