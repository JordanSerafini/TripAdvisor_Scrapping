import googleSearch from './googleSearch.js';
import pkg from 'pg';
const { Client } = pkg;

// DB_USER=jordans
// DB_PASS=slitest
// DB_NAME=scrapping
// DB_HOST=localhost
// DB_PORT=5432

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
});

const query = 'SELECT name, address FROM restaurants';
const list = [];

client.connect();

client.query(query, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    for (let row of res.rows) {
        const combined = `${row.name} ${row.address}`;
        list.push(combined);
    }

    list.forEach((resto, index) => {
        googleSearch(`tripadvisor ${resto}`);
        console.log(`Recherche pour le resto ${index + 1}: tripadvisor ${resto}`);
    });

    client.end();
});
