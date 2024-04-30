// NodeJS File

const express = require('express');
const https = require("https");
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

const port = process.env.PORT;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Create a connection pool to MySQL database
const connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4', // To support emojis
});

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// middleware function that handles errors
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Internal Server Error')
})

// routes
app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/contact', function (req, res) {
  res.sendFile(__dirname + '/public/ContactUs.html');
});

app.get('/featured', function (req, res) {
  res.sendFile(__dirname + '/public/featured.html');
});

app.get('/team', function (req, res) {
  res.sendFile(__dirname + '/public/team.html');
});

app.get('/recruit', function (req, res) {
  res.sendFile(__dirname + '/public/recruit.html');
});

// Route to handle login form submission
app.post('/login', (req, res) => {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const username = req.body.username;

  if (username === adminUsername && req.body.password === adminPassword) { 
    req.session.loggedin = true;
    res.redirect('/dashboard');
  } else {
    res.status(401).send('<script>alert("Invalid username or password"); window.location.href = "/login";</script>');
  }
});

// Function to truncate the content
function truncateContent(content, length = 100) {
  if (!content) {
    return '';
  }

  if (content.length <= length) {
    return content;
  }

  return content.substring(0, length) + '...';
}

//Dashboard 
app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

// Companies Registration
app.get('/register', (req, res) => {
  res.render('companies');
});

app.post('/register', (req, res) => {
  const selectedTab = req.body.selectedTab;
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'placements@mac.du.ac.in',
      pass: 'Placements@2024',
    },
  });

  // Define email content based on the selected tab
  let emailContent = '';
  switch (selectedTab) {
    case 'placement-tab':
      const {
        companyEmailPlacement,
        companyNamePlacement,
        jobProfilesPlacement,
        ctcPlacement,
        descriptionPlacement,
      } = req.body;

      // Construct email content for placement tab
      emailContent = `
        <h1>Company Registration Details</h1>
        <h2>Placement</h2>
        <p>Email ID: ${companyEmailPlacement}</p>
        <p>Company Name: ${companyNamePlacement}</p>
        <p>Job Profiles: ${jobProfilesPlacement}</p>
        <p>CTC: ${ctcPlacement}</p>
        <p style="white-space: pre-line;">Description: ${descriptionPlacement}</p> <!-- Add description field -->
      `;
      break;

    case 'internship-tab':
      const {
        companyEmailInternship,
        companyNameInternship,
        jobProfilesInternship,
        duration,
        descriptionInternship,
      } = req.body;

      // Construct email content for internship tab
      emailContent = `
        <h1>Company Registration Details</h1>
        <h2>Internship</h2>
        <p>Email ID: ${companyEmailInternship}</p>
        <p>Company Name: ${companyNameInternship}</p>
        <p>Job Profiles: ${jobProfilesInternship}</p>
        <p>Duration: ${duration}</p>
        <p style="white-space: pre-line;">Description: ${descriptionInternship}</p> <!-- Add description field -->
      `;
      break;

    case 'workshop-tab':
      const {
        companyEmailWorkshop,
        speakerName,
        speakerDesignation,
        topic,
        descriptionWorkshop,
      } = req.body;

      // Construct email content for workshop tab
      emailContent = `
        <h1>Company Registration Details</h1>
        <h2>Workshop</h2>
        <p>Email ID: ${companyEmailWorkshop}</p>
        <p>Speaker Name: ${speakerName}</p>
        <p>Speaker Designation: ${speakerDesignation}</p>
        <p>Topic: ${topic}</p>
        <p style="white-space: pre-line;">Description: ${descriptionWorkshop}</p> <!-- Add description field -->
      `;
      break;

    default:
      res.status(400).send('Invalid tab selected');
      return;
  }

  // Define email options
  const mailOptions = {
    from: 'Your Website <noreply@yourwebsite.com>',
    to: 'placements@mac.du.ac.in',
    subject: 'New Company Registration',
    html: emailContent,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send('Error sending email.');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent successfully.');
    }
  });
});


// GET route to render the Notice page with notices
app.get('/notices', (req, res) => {
  const sql = 'SELECT * FROM notices';

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const showActions = req.session.loggedin; // Check if user is logged in
    res.render('notice.ejs', { notices: rows, truncateContent: truncateContent, showActions: showActions });
  });
});

app.post('/notices', (req, res) => {
  const { title, description, content } = req.body;
  const sql = 'INSERT INTO notices (title, description, content) VALUES (?, ?, ?)';

  connection.query(sql, [title, description, content], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.redirect('/');
  });
});


app.post('/notices/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, content } = req.body;
  const sql = 'UPDATE notices SET title=?, description=?, content=? WHERE id=?';

  connection.query(sql, [title, description, content, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.redirect('/');
  });
});

app.post('/notices/:id/delete', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM notices WHERE id=?';

  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.redirect('/');
  });
});


// Events 
app.get('/events', (req, res) => {
  const sql = 'SELECT * FROM mytables';
  const sql2 = 'SELECT * FROM mytables2';
  const sql3 = 'SELECT * FROM mytables3';
  const sql4 = 'SELECT * FROM mytables4';

  connection.query(sql, (err, rows) => {
    if (err) throw err;

    connection.query(sql2, (err, rows2) => {
      if (err) throw err;

      connection.query(sql3, (err, rows3) => {
        if (err) throw err;

        connection.query(sql4, (err, rows4) => {
          if (err) throw err;

          if (req.session.loggedin) {
            res.render('events.ejs', { rows, rows2, rows3, rows4, showActions: true });
          } else {
            res.render('events.ejs', { rows, rows2, rows3, rows4, showActions: false });
          }
        });
      });
    });
  });
});

//for 2021-22

app.post('/add_data', async (req, res) => {
  try {
    const { date, title, sname, desg, report, outcomes, participants } = req.body;
    const sql = `INSERT INTO mytables (date, title, sname, desg, report, outcomes, participants) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const result = await connection.query(sql, [date, title, sname, desg, report, outcomes, participants]);
    console.log(result);
    res.send('Data added successfully.');
  } catch (e) {
    console.log(e);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/delete_data', async (req, res) => {
  try {
    const { id } = req.body;
    const sql = `DELETE FROM mytables WHERE id=?`;
    const result = await connection.query(sql, [id]);
    console.log(result);
    res.send('Data deleted successfully.');
  } catch (e) {
    console.log(e);
    res.status(500).send('Internal Server Error');
  }
});

//for 2022-23

app.post('/add_data2', async (req, res) => {
  try {
    const { date2, title2, sname2, desg2, report2, outcomes2, participants2 } = req.body;
    const sql2 = `INSERT INTO mytables2 (date2, title2, sname2, desg2, report2, outcomes2, participants2) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const result2 = await connection.query(sql2, [date2, title2, sname2, desg2, report2, outcomes2, participants2]);
    console.log(result2);
    res.send('Data added successfully.');
  } catch (e) {
    console.log(e);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/delete_data2', async (req, res) => {
  try {
    const { id2 } = req.body;
    if (!id2) {
      throw new Error('No id2 provided');
    }
    const sql2 = `DELETE FROM mytables2 WHERE id2=?`;
    const result2 = await connection.query(sql2, [id2]);
    console.log(result2);
    res.send('Data deleted successfully.');
  } catch (e) {
    console.log(e);
    res.status(500).send('Internal Server Error');
  }
});

// 2023-24
app.post('/add_data3', async (req, res) => {
  try {
    const { date3, title3, sname3, desg3, report3, outcomes3, participants3 } = req.body;
    const sql3 = `INSERT INTO mytables3 (date3, title3, sname3, desg3, report3, outcomes3, participants3) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const result3 = await connection.query(sql3, [date3, title3, sname3, desg3, report3, outcomes3, participants3]);
    console.log(result3);
    res.send('Data added successfully.');
  } catch (e) {
    console.log(e);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/delete_data3', async (req, res) => {
  try {
    const { id3 } = req.body;
    if (!id3) {
      throw new Error('No id3 provided');
    }
    const sql3 = `DELETE FROM mytables3 WHERE id3=?`;
    const result3 = await connection.query(sql3, [id3]);
    console.log(result3);
    res.send('Data deleted successfully.');
  } catch (e) {
    console.log(e);
    res.status(500).send('Internal Server Error');
  }
});

// 2024-25
app.post('/add_data4', async (req, res) => {
  try {
    const { date4, title4, sname4, desg4, report4, outcomes4, participants4 } = req.body;
    const sql4 = `INSERT INTO mytables4 (date4, title4, sname4, desg4, report4, outcomes4, participants4) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const result4 = await connection.query(sql4, [date4, title4, sname4, desg4, report4, outcomes4, participants4]);
    console.log(result4);
    res.send('Data added successfully.');
  } catch (e) {
    console.log(e);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/delete_data4', async (req, res) => {
  try {
    const { id4 } = req.body;
    if (!id4) {
      throw new Error('No id4 provided');
    }
    const sql4 = `DELETE FROM mytables4 WHERE id4=?`;
    const result4 = await connection.query(sql4, [id4]);
    console.log(result4);
    res.send('Data deleted successfully.');
  } catch (e) {
    console.log(e);
    res.status(500).send('Internal Server Error');
  }
});

process.on("uncaughtException", function (err) {
  console.error(err);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}/`);
});