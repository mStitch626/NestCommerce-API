# Product Management API

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [Testing](#testing)

## Introduction
The **Product Management API** provides a robust backend service to manage products and categories with role-based access control. This API is developed using **NestJS** with **MongoDB** as the database. Key features include product creation, retrieval, updating, and deletion, along with the support for category management.

## Features
- **Product Management**: Create, retrieve, update, and delete products.
- **Category Management**: Manage product categories for better organization.
- **Role-Based Access Control (RBAC)**: Roles like Admin, Manager, and Client determine the level of access and permissions.
- **JWT Authentication**: Secure endpoints using JSON Web Tokens.
- **Pagination and Filters**: Efficient querying with pagination and various filters.
- **Swagger API Documentation**: Interactive API documentation.
- **Testing**: Unit testing with mocks for services.

## Technologies
- **NestJS**: Backend framework used to build scalable server-side applications.
- **MongoDB**: NoSQL database for storing products and categories.
- **Passport.js & JWT**: For authentication and authorization.
- **TypeScript**: Strongly typed programming language.
- **Swagger**: API documentation and exploration tool.
- **Jest**: Unit testing framework.

## Installation

### Prerequisites
Ensure that the following are installed:
- **Node.js** (version 18.x or later)
- **MongoDB** (version 5.x or later)

### Install dependencies
```bash
npm install .
```
## MongoDB Setup
#### **Creating the Database**
1. Start your MongoDB server and create a new database
2. **Importing collections**: 
Import the users, categories, and products collections from the database folder using the following command:
```bash
mongoimport --db your_database_name --collection your_collection_name --file path_to_your_file.json --jsonArray
```
Be sure to replace `your_database_name`, `your_collection_name`, and `path_to_your_file.json` with your actual database name, collection name, and file path, respectively.

  **Note: This step is only required for the initial setup to create an admin user. This admin user will enable you to log in and create additional users, categories, and products.**

3. **Troubleshooting Import Issues**
If the import does not work as expected, you can try using MongoDB Compass for a more user-friendly import experience. Alternatively, you can skip this step and disable authentication temporarily to create an admin user.

## Running the Project
### Environment Variables
To run this project, you will need to set the following environment variables in the .env file

`DB_HOST`

`DB_NAME`

`DB_PORT`

`JWT_SECRET`

`JWT_REFRESH_SECRET`

`ACCESS_TOKEN_LIVED`

`REFRESH_TOKEN_LIVED`

### Running the app
**development**
```bash
npm run start
```
**watch mode**
```bash
npm run start:dev
```
## API documentation
You can access the generated API documentation at:
http://localhost:3000/api-docs
<br>
Make sure to replace `localhost:3000` with your server's actual address if it's hosted elsewhere.

## Testing
```bash
npm run test
```
