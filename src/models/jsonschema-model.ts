const userPassword = {
    type: 'string',
    format: '^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\\s]).{8,}$',
};

const userEmail = {
    type: 'string',
    minLength: 5,
    format: 'email',
};

const userSignInSchema = {
    type: 'object',
    properties: {
        email: userEmail,
        password: userPassword
    },
    required: ['email', 'password'],
};

const userSignUpSchema = {
    type: 'object',
    properties: {
        email: userEmail,
        password: userPassword
    },
    required: ['email', 'password'],
};

export {
    userSignInSchema,
    userSignUpSchema,
}
