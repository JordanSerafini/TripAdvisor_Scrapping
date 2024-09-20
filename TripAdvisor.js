import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

puppeteer.use(StealthPlugin());

const delay = (min, max) => new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--start-maximized',
            '--disable-web-security',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--disable-dev-shm-usage',
            '--window-size=1920,1080',
        ],
    });
    const page = await browser.newPage();

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36');
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Referer': 'https://www.google.com/',
        });

        // Anti-detection
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });
        });

        console.log('Navigating to Tripadvisor...');
        await page.goto('https://www.tripadvisor.fr/', { waitUntil: 'networkidle2' });

        // Attendre que l'input apparaisse
        await page.waitForSelector('input[role="searchbox"]', { visible: true });
        console.log('Remplissage du champ de recherche...');

        // Simuler le remplissage de l'input
        await page.type('input[role="searchbox"]', 'Haylton Auberge d\'Anglefort 1 place la Fontaine 01350 Anglefort');
        await delay(1000, 2000);

        await page.click('button[type="button"]');
        console.log('Recherche soumise...');
        await delay(2000, 3000);

        // Simuler un comportement humain (exemple de mouvement de la souris)
        await page.mouse.move(500, 300);
        await delay(500, 1000);
        await page.mouse.move(800, 400);
        await delay(500, 1000);

        // Attendre que le bouton de fermeture apparaisse (avec data-automation="closeModal")
        await page.waitForSelector('button[data-automation="closeModal"]', { visible: true });
        console.log('Bouton de fermeture détecté...');

        // Simuler le clic sur le bouton "Fermer"
        await page.click('button[data-automation="closeModal"]');
        console.log('Clic sur le bouton de fermeture...');
        await delay(2000, 3000);

        // Attendre quelques secondes pour laisser le temps à l'animation de se terminer
        await delay(5000, 6000);
    } catch (error) {
        console.error('Erreur dans le processus:', error);
    } finally {
        // Optionnellement, fermer le navigateur
        // await browser.close();
        console.log('Navigateur fermé.');
    }
})();
