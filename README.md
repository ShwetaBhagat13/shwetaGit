# Training and Placement Cell Website

Welcome to the Training and Placement Cell website for Maharaja Agarsen College. This website is designed to provide information about training and placement activities at our college.

## Prerequisites

Before you get started, make sure you have the following software and dependencies installed:

- [Visual Studio Code](https://code.visualstudio.com/) for code editing.
- [Node.js](https://nodejs.org/) for the backend.
- [MySQL](https://www.mysql.com/) for the database.


## The installed packages are:

basic-auth@2.0.1
body-parser@1.20.2
cookie-parser@1.4.6
ejs@3.1.9
express-session@1.17.3
express@4.18.2
https@1.0.0
mysql@2.18.1
mysql2@3.3.5
nodemon@2.0.22


## Website Sections
You can access the following pages on the website:

Homepage: The main landing page of the website.
Why Recruitment : Get to know about the Recruitment and its process.
Notice Section: Find the latest notices and updates related to training and placement.
Events: Stay updated with events and activities.
Team : Get to know the team behind the Training and Placement Cell.
Contact Details: Find contact information for inquiries and support.


## MYSQL Import
Ensure that you have set up your MySQL database with the name "mytables" and imported the necessary data using the following command:

mysql -u root -pShweta1234 mytables < tpcdata.sql


## Running the Website
To run the website locally, open your terminal and execute the following command:
node server.js

Or, if you prefer to use nodemon for automatic server restarts during development:
nodemon server.js

Now, you can access the website by opening a web browser and navigating to http://localhost:3000/
