# ``API api/register || API api/login  ||  API api/refresh-token``

## User Authentication API
The User Authentication API offers a range of endpoints designed for seamless user registration and authentication. This powerful API facilitates the secure creation of user accounts, streamlines the login process, and implements token-based authentication to safeguard sensitive resources. Additionally, it provides the capability for token refresh, ensuring a continuous and secure user experience. This comprehensive set of functionalities aims to enhance the security and ease of use in managing user identities within your application.

### Endpoints
1. POST api/register
2. POST api/login
3. POST api/refresh-token

### Endpoint: POST /register
`Register a New User`
This endpoint only supports the values of `name`, `email and password`.
- Request:
{
  "name": "mayra",
  "email": "mayra@example.com",
  "password": "password123"
}
- Response:
{
    "response": {
        "acknowledged": true,
        "insertedId": "65634483f029b426103cee70"
    }
}
### Validations 'POST'
- `name`: The username should be a "string" containing alphanumeric characters (A-Z, a-z, 0-9), accented characters (á, é, í, ó, ú, Á, É, Í, Ó, Ú, ñ, Ñ), and the underscore symbol _. Special characters are not allowed. It's essential to ensure that the username adheres to the specified character set and pattern (A-Za-z0-9áéíóúÁÉÍÓÚñÑ_).

- `email`: The email field should be unique for each user and follow the standard email format, such as "mayra@example.com." Ensuring email uniqueness is crucial for user identification. The email address should adhere to the specified format and be distinct for each user within the system.

- `password`: The password is the user's authentication key. It should consist of a minimum of 8 characters. The password must include at least one numerical value or a literal character. This requirement enhances password strength, making it more secure against potential threats. Users are encouraged to create robust passwords to protect their accounts effectively.

### Endpoint: POST /login
User Login
This endpoint only supports the values of `email` and `password`.
- Request:
{
  "email": "mayra@example.com",
  "password": "password123"
}
- Response:
{
    "message": "successful login",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NjM0NDgzZjAyOWI0MjYxMDNjZWU3MCIsImlhdCI6MTcwMTAwNTkzOCwiZXhwIjoxNzAxMDkyMzM4fQ.hZ_GMd21LPr5XzeX8Ml9OZjRQOUOSN5sOkwOp56ptaM"
}
### Validations 'POST'
- `email`: The email field is expected to be of type "string" and follows the standard email format, such as "mayra@example.com." The email serves as a unique identifier for each user, ensuring that it conforms to the defined structure of an email address.

- `password`: The password field is designed to store the user's chosen password. This password is a crucial element for user authentication. It should be created by the user and must adhere to the security policies set by the system. A strong password is encouraged, typically requiring a combination of uppercase and lowercase letters, numbers, and special characters for enhanced security. Users are recommended to choose passwords that are both secure and memorable.

### Endpoint: POST /refresh-token
refreshes the token once it expires.
- Request:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NjM0NDgzZjAyOWI0MjYxMDNjZWU3MCIsImlhdCI6MTcwMTAwNTkzOCwiZXhwIjoxNzAxMDkyMzM4fQ.hZ_GMd21LPr5XzeX8Ml9OZjRQOUOSN5sOkwOp56ptaM"
}
- Response:
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NjM0NDgzZjAyOWI0MjYxMDNjZWU3MCIsImlhdCI6MTcwMTAwNjQ1MywiZXhwIjoxNzAxMDkyODUzfQ.-AwemhPnmOpl2jhb54Os22vIIpYNqIbXGWO2NJrI_dI"
}

### Validations
- refreshToken: The token is validated if it was signed by the system or not, if it has been altered in the course of its use.