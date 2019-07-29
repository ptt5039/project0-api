import session from 'express-session';

const sessionConfiguration = {
    secret: 'magic',
    cookie: { secure: false },
    resave: true,
    saveUninitialized: true
};

export const sessionMiddleware = session(sessionConfiguration);