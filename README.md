# Movie API
Movie API myFlix is the backend part of a fullstack web application that provides users with information about movies, directors, genres etc.
Users can sign up, update their profile info and personal list of favorite movies

This project is an example of RESTful API using MongoDB, Express and Node.js with business logic modeled using Mongoose. The authentication and authorization are implemented using basic HTTP Authentication and JWT Tokens.
## Tech Tools:
### Core Stack
- Node - Runtime environment for executing JavaScript on a server
- Express - Web application framework for building REST API
- MongoDB - NoSQL database used to store movie and user data.
- Mongoose - Object Data Modelling (ODM) library for modeling and interacting with MongoDB

### Middleware & Utilities
- body-parser – Parses incoming request bodies (e.g., JSON).
- morgan – HTTP request logger used for debugging and monitoring API activity.
- cors – Enables cross-origin resource sharing, allowing requests from different domains.
- express-validator – Provides request validation and sanitization for secure data handling.
- uuid – Generates unique identifiers for resources where needed.

### Authentication & Security
- passport – Authentication middleware for handling login and protected routes.
- passport-jwt – Strategy for authenticating users using JSON Web Tokens (JWT).
- jsonwebtoken – Creates and verifies JWTs for user authentication.


## Setup
In order to use the App you need to either:
- download the files
- clone the repository

from GitHub repository.
Then you have to install the necessary dependencies by running `npm install` in the project directory via Terminal.
You also have to update the variable `databseUrl` in index.js line 2 with your location of the database containing movies and users collections.

## Features
1. Users:
- Allow new users to **register**
- Allow users to **login** and obtain a JWT token
- Allow users to **update their user info** (username, password, email, date of birth)
- Allow users to **add a movie** to their list of favorites
- Allow users to **remove a movie** from their list of favorites
- Allow existing users to **deregister**
2. Movies
- Return a **list of ALL movies** to the user
- Return data about a **single movie** (description, genre, director, image URL, whether it’s featured or not) by title to the user
- Return data about a **genre** (description) by name/title (e.g., “Thriller”)
- Return data about a **director** (bio, birth year, death year) by name

## API endpoint overview
| Endpoint                         | HTTP Method | Description                                                                           |
| -------------------------------- | ----------- | ------------------------------------------------------------------------------------- |
| /login                           | POST        | Login registered user to obtain a JWT token.                                          |
| /users                           | POST        | Registers a new user with username, password, email, and birthday.                    |
| /users/:username                 | PUT         | Updates an existing user's profile (username, password, email, birthday) by username. |
| /users/:username                 | DELETE      | Deletes a user account by username.                                                   |
| /users/:username/movies/:movieID | POST        | Adds a movie to a user's list of favorites by username and movie ID.                  |
| /users/:username/movies/:movieID | DELETE      | Removes a movie from a user's list of favorites by username and movie ID.             |
| /movies                          | GET         | Returns a list of all movies.                                                         |
| /movies/:title                   | GET         | Returns a single movie matching the provided title.                                   |
| /movies/genre/:genreName         | GET         | Returns a single genre matching the provided genre name.                              |
| /movies/directors/:directorName  | GET         | Returns information about a director matching the provided director name.             |