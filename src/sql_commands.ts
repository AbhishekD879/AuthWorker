export const CREATE_USER_TABLE = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    phone VARCHAR(255),
    profile_pic VARCHAR(255)
);
`;

export const CREATE_USER = `INSERT INTO users (email, password, firstname, lastname, phone, profile_pic) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

export const GET_USER = `SELECT * FROM users WHERE email = $1`;
