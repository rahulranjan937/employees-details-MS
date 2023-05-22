# Employees Contact Details Management System (ECDMS)

## Introduction

This is a simple project to manage the contact details of employees in a company. The project is developed using Node.js and Express.js framework. The project is developed by [Rahul Ranjan](https://github.com/rahulranjan937)

## Requirements

- Node.js v18.0.0
- MySQL v8.0.25
- Postman (optional)

## Installation

- Clone the repository
- Install the dependencies
- Create a database in MySQL
- Copy the `.env.example` file and rename it to `.env` and fill the required details
- Run the server using the command `npm run dev` or `npm start`
- Open the browser and go to the url: http://localhost:3333/
- The project is now running on your local machine
- To stop the server, press `Ctrl + C` in the terminal

## Usage

- Open the browser and go to the url: http://localhost:3333/
- Use the API endpoints to perform the required operations 
- Postman can also be used to perform the operations
- The API endpoints are listed below
- The API endpoints can also be found in the `routes/employees.routes.js` file

## API Endpoints

- **GET** `/api/employees` - Get all the employees
- **GET** `/api/employees/:id` - Get an employee by id
- **POST** `/api/employees` - Create a new employee
- **PUT** `/api/employees/:id` - Update an employee by id
- **DELETE** `/api/employees/:id` - Delete an employee by id

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Contact

[Rahul Ranjan](https://github.com/rahulranjan937)
