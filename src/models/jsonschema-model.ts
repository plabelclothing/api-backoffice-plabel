const userPassword = {
    type: 'string',
    format: '^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\\s]).{8,}$',
};

const userEmail = {
    type: 'string',
    minLength: 5,
    format: 'email',
};

const orderCondition = {
    type: 'array',
    items: {
        type: 'string',
    },
}

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

const orderGetSchema = {
    type: 'object',
    properties: {
        dateFrom: {
            type: 'number',
        },
        dateTo: {
            type: 'number',
        },
        timezone: {
            type: 'string',
        },
        conditions: {
            type: 'object',
            properties: {
                user_order__external_id: orderCondition,
                user__email: orderCondition,
                user_order__status: orderCondition,
                user_order__order_status: orderCondition,
            },
            additionalProperties: false,
        }
    },
    required: ['timezone'],
}

const orderGetByUuidSchema = {
    type: 'object',
    properties: {
        timezone: {
            type: 'string',
        },
    },
    required: ['timezone'],
}

export {
    userSignInSchema,
    userSignUpSchema,
    orderGetSchema,
    orderGetByUuidSchema,
}
