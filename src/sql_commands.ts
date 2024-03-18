export const CREATE_USER_TABLE = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL
);
`;

export const CREATE_USER = `INSERT INTO users (email, password, salt) VALUES ($1, $2, $3) RETURNING *`;

export const GET_USER = `SELECT * FROM users WHERE email = $1`;

export const DELETE_USER = `DELETE FROM users WHERE email = $1`;
