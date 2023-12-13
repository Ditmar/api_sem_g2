
export const authMessages = {
    tokenMissing: 'Unauthorized: No token provided',
    tokenInvalid: 'Unauthorized: Invalid token', 
};

export const userMessages = {
    userNotFound: 'User not found',
    userCreated: 'User successfully created',
    
    incorrectCredentials: 'incorrect credentials',
    userLogin: 'successful login',
    userExists: 'the email is already exists'
};
export const rolMessages = {
    rolMissing: 'there is no role ',
    rolSome: 'access denied', 
};
export const serverMessages = {
    serverError: 'Internal Server Error',
};
export const articleMessages = {
    articleFind: 'article not found',
    pdfRequired: 'Select a valid PDF file',
    articleDeleted: 'article successfully deleted',
};



export const LoginMessages = {
    emailIncorect: 'Invalid email format. Please enter a valid email address.',
    emailRequired: 'The email field is required. Please provide your email address.',
    passwordIncorect: 'Enter a password with at least one letter, one digit (0-9), and at least 8 characters.',
    passwordRequired: 'The password field is required. Please provide a valid password with at least 8 characters.',
};

export const RegisterMessages = {
    nameIncorect: 'Enter only alphanumeric values between 2 and 50 characters in the name field.',
    nameRequired: 'The name field is required. Please provide your name.',
};

export const RefreshTokenMessages = {
    tokenIncorect: 'Invalid token. Please provide a valid refresh token.',
    tokenRequired: 'The refreshToken field is required. Please provide a refresh token.',
    tokenDinied: 'Unauthorized access. The provided token is not authorized for this action.'
};