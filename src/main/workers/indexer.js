import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

class Indexer {
    constructor() {
        this.browser = null;
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) { return }
        
        const executablePath = this.getBrowserPath();
        
        if (!executablePath) {
            throw new Error('Не найден установленный браузер. Пожалуйста, установите Chrome или Edge.');
        }

        this.browser = await puppeteer.launch({
            headless: 'shell',
            executablePath: executablePath,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--disable-quic',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
                '--ignore-certificate-errors',
                '--disable-blink-features=AutomationControlled',
            ]
        });
        this.isInitialized = true;
    }

    getBrowserPath() {
        const { platform } = process;
        
        if (platform === 'win32') {
            const paths = [
                'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
                'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
                'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
                'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
                process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
                process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\Application\\msedge.exe',
            ];
            
            for (const path of paths) {
                try {
                    if (require('fs').existsSync(path)) {
                        return path;
                    }
                } catch (e) {
                    continue;
                }
            }
        }
        
        if (platform === 'darwin') {
            const paths = [
                '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
                '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
            ];
            
            for (const path of paths) {
                try {
                    if (require('fs').existsSync(path)) {
                        return path;
                    }
                } catch (e) {
                    continue;
                }
            }
        }
        
        if (platform === 'linux') {
            const paths = [
                '/usr/bin/google-chrome',
                '/usr/bin/google-chrome-stable',
                '/usr/bin/chromium-browser',
                '/usr/bin/chromium',
                '/usr/bin/brave-browser',
            ];
            
            for (const path of paths) {
                try {
                    if (require('fs').existsSync(path)) {
                        return path;
                    }
                } catch (e) {
                    continue;
                }
            }
        }
        
        return null;
    }

    async getPrerenderedHTML(url) {
        if (!this.isInitialized) {
            await this.init();
        }
        const page = await this.browser.newPage();
        try {
            await page.goto(url, { waitUntil: 'networkidle2' });
            const html = await page.content();
            return html
        } finally {
            await page.close({ runBeforeUnload: true })
        }
    }
}

const indexer = new Indexer();

export async function indexPage(pageNumber = null, totalPageCount = null) {
    if (pageNumber === null) {
        pageNumber = 1
    }

    const result = {
        totalPageCount: totalPageCount,
        nextPage: null,
        rows: []
    }

    // Инициализация произойдет автоматически при первом вызове
    const html = await indexer.getPrerenderedHTML(
        `https://zakupki.gov.ru/epz/order/extendedsearch/results.html?morphology=on&search-filter=%D0%94%D0%B0%D1%82%D0%B5+%D1%80%D0%B0%D0%B7%D0%BC%D0%B5%D1%89%D0%B5%D0%BD%D0%B8%D1%8F&pageNumber=${pageNumber}&sortDirection=true&recordsPerPage=_10&showLotsInfoHidden=false&sortBy=PUBLISH_DATE&fz44=on&fz223=on&af=on&currencyIdGeneral=-1&applSubmissionCloseDateFrom=28.06.2026&okpd2IdsWithNested=on&okpd2Ids=8874711%2C8876117%2C8876110&okpd2IdsCodes=63.12%2C62.09.2%2C62.01.1`
    )

    const $ = cheerio.load(html)
    if (totalPageCount === null) {
        const totalText = $('.search-results__total').text().trim();
        const rowsCount = Number(totalText.split(' ')[0])
        const pageCount = Math.ceil(rowsCount / 10)
        result.totalPageCount = pageCount
    }

    const elements = [];
    $('.search-registry-entry-block').each((i, el) => {
        const numberElement = $(el).find('.registry-entry__header-mid__number')
        const linkElement = numberElement.find('a')
        const priceElement = $(el).find('.price-block__value')

        const row = {
            key: linkElement.text().trim().split(' ')[1],
            ref: linkElement.attr('href'),
            start_price: priceElement.text().trim().replace(/[^0-9,]/g, ' ')
        }

        elements.push(row)
    })

    // console.log(elements)

    result.rows = elements
    if (pageNumber < result.totalPageCount) {
        result.nextPage = pageNumber + 1
    } else {
        result.nextPage = null
    }

    return result
}