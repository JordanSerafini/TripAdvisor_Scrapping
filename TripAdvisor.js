import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

puppeteer.use(StealthPlugin());

const delay = (min, max) => new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36');
        console.log('Navigating to Tripadvisor...');

        await page.goto('https://www.tripadvisor.fr/', { waitUntil: 'networkidle2' });

        await page.waitForSelector('input[role="searchbox"]', { visible: true });
        console.log('Remplissage du champ de recherche...');

        await page.type('input[role="searchbox"]', 'Haylton Auberge d\'Anglefort 1 place la Fontaine 01350 Anglefort');
        await delay(1000, 2000);

        await page.click('button[type="button"]');
        console.log('Recherche soumise...');
        await delay(2000, 3000);

        await page.waitForSelector('a[target="_blank"]', { visible: true });
        console.log('Résultats de recherche chargés...');

        const resultLinks = await page.$$('a[target="_blank"]');
        if (resultLinks.length > 1) {
            await resultLinks[1].click();
            console.log('Clic sur le deuxième résultat...');
        } else {
            console.log('Moins de deux résultats trouvés.');
        }

        await delay(5000, 6000);
    } catch (error) {
        console.error('Erreur dans le processus:', error);
    } finally {
        await browser.close();
        console.log('Navigateur fermé.');
    }
})();
