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

        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });
        });

        await page.goto('https://www.google.com/', { waitUntil: 'networkidle2' });

        try {
            await page.waitForSelector('button[id="L2AGLb"]', { visible: true, timeout: 15000 });
            await page.click('button[id="L2AGLb"]');
            await delay(1000, 2000);
        } catch (e) {}

        const searchQuery = 'tripadvisor lac casa annecy 74';
        await page.type('textarea[name="q"]', searchQuery, { delay: 100 });

        await page.keyboard.press('Enter');
        await delay(2000, 3000);

        await page.waitForSelector('h3', { visible: true });
        await page.evaluate(() => {
            document.querySelector('h3').closest('a').click();
        });

        await delay(5000, 6000);

        try {
            await page.waitForSelector('textarea[name="q"]', { visible: true, timeout: 15000 });
            console.log('Pas de CAPTCHA détecté, continuation...');
        } catch (error) {
            console.log('CAPTCHA détecté. Attente jusqu\'à ce qu\'il soit résolu...');
            await page.waitForSelector('textarea[name="q"]', { visible: true });
            console.log('CAPTCHA résolu, continuation...');
        }

        await delay(5000, 6000);

        await page.waitForSelector('a[href^="mailto:"]', { visible: true });

        const email = await page.evaluate(() => {
            const emailLink = document.querySelector('a[href^="mailto:"]');
            return emailLink ? emailLink.getAttribute('href').replace('mailto:', '') : null;
        });

        if (email) {
            console.log('Email trouvé:', email);
        } else {
            console.log('Aucun email trouvé.');
        }

    } catch (error) {
        console.error('Erreur dans le processus:', error);
    } finally {
        console.log('Navigateur fermé.');
        await browser.close();
    }
})();
