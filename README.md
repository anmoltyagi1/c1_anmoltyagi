# Max Points Calculator - Capital One Coding Challenge (Anmol Tyagi)

## Overview

### Live Demo: http://178.128.239.147:3000/

This project is a MERN full-stack application designed to calculate the maximum points a user can earn based on their monthly transactions. Users enter their transactions in JSON format, and the application applies specific rules to determine the points earned for each transaction and the total points for the month.

## Rules for Point Calculation

The application uses the following rules to calculate points:

1. **Rule 1:** 500 points for every $75 spent at Sport Check, $25 spent at Tim Hortons, and $25 spent at Subway.
2. **Rule 2:** 300 points for every $75 spent at Sport Check and $25 spent at Tim Hortons.
3. **Rule 3:** 200 points for every $75 spent at Sport Check.
4. **Rule 4:** 150 points for every $25 spent at Sport Check, $10 spent at Tim Hortons, and $10 spent at Subway.
5. **Rule 5:** 75 points for every $25 spent at Sport Check and $10 spent at Tim Hortons.
6. **Rule 6:** 75 points for every $20 spent at Sport Check.
7. **Rule 7:** 1 point for every $1 spent for all other purchases (including leftover amount).

## Technology Stack

The application is built using the MERN stack (MongoDB, Express, React, Node). Prisma is utilized as the ORM (Object-Relational Mapping) for MongoDB, allowing seamless interaction with the database. The rules for point calculation are stored using Prisma.

## How to Use

1. **Install Dependencies:**

   - Make sure you have Node.js and npm installed.
   - Run `npm install` in the project directory to install backend dependencies.
   - Navigate to the `client` directory and run `npm install` to install frontend dependencies.

2. **Database Setup:**

   - Set up a MongoDB instance and update the connection string in the `config/default.json` file.
   - Enter the .env file sent in the zip folder from the email

3. **Run the Application:**

   - Run `npm start` in the server directory to start the backend server.
   - Navigate to the `frontend` directory and run `npm start` to start the React frontend.

4. **Usage:**
   - Access the application in your web browser.
   - Enter monthly transactions in JSON format.
   - View the calculated maximum points for each transaction and the total points for the month.

## Additional Features

- **Dynamic Programming Memoization:**
  - The application utilizes dynamic programming memoization to optimize the calculation of maximum points, ensuring efficient processing.

Feel free to explore and modify the code to suit your requirements! If you encounter any issues or have questions, please refer to the documentation or reach out to the project owner.

Happy calculating!
