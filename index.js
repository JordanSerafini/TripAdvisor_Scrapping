import googleSearch from './googleSearch.js';
import pkg from 'pg';
const { Client } = pkg;


const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
});

console.log(client);


const resto = 'les moustaches de zebulon 74 annecy';

//googleSearch(`tripadvisor ${resto}`);
