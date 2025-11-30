import pool from "../config/database.js";

const createUser = async () =>{
    const query = `
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
    )`;

    try{
        pool.query(query);
        console.log("User table created");
    }catch(error){
        console.log("error created in user table");
    }
}

export default createUser;