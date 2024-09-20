import googleSearch from './googleSearch.js';
import pkg from 'pg';
import dotenv from 'dotenv';
import { exec } from 'child_process';

dotenv.config();
const { Client } = pkg;

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
});

const query = 'SELECT name, address FROM restaurant_74';
const list = [];

client.connect();

client.query(query, async (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    for (let row of res.rows) {
        const combined = `${row.name} ${row.address}`;
        list.push(combined);
    }

    for (let index = 0; index < list.length; index++) {
        const resto = list[index];

        // Exécuter le script AutoHotKey pour la déconnexion
        await new Promise((resolve, reject) => {
            exec('"C:/Program Files/AutoHotKey/AutoHotkey.exe" "C:\\Users\\jorda\\OneDrive\\Bureau\\VM\\Partage VM-Tinkerbell-Kali\\code\\!!!Hack\\scrapping\\TripAdvisor_Scrapping\\nordvpn_disconnect.ahk"', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing AHK disconnect script: ${error.message}`);
                    return reject(error);
                }
                console.log(`NordVPN disconnect script output: ${stdout}`);
                resolve();
            });
        });

        // Exécuter le script AutoHotKey pour la reconnexion
        await new Promise((resolve, reject) => {
            exec('"C:/Program Files/AutoHotKey/AutoHotkey.exe" "C:\\Users\\jorda\\OneDrive\\Bureau\\VM\\Partage VM-Tinkerbell-Kali\\code\\!!!Hack\\scrapping\\TripAdvisor_Scrapping\\nordvpn_connect.ahk"', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing AHK connect script: ${error.message}`);
                    return reject(error);
                }
                console.log(`NordVPN connect script output: ${stdout}`);
                resolve();
            });
        });

        // Effectuer la recherche Google après la reconnexion
        try {
            await googleSearch(`tripadvisor ${resto}`);
            console.log(`Recherche pour le resto ${index + 1}: tripadvisor ${resto}`);
        } catch (error) {
            console.error(`Failed to search for ${resto}:`, error);
        }
    }

    client.end();
});
