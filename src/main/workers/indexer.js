import puppeteer from 'puppeteer';

async function getPrerenderedHTML(url) {
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--disable-quic',
            '--disable-web-security',      // Отключаем CORS и безопасность
            '--disable-features=IsolateOrigins,site-per-process',
            '--ignore-certificate-errors',  // Игнорируем SSL ошибки
            '--disable-blink-features=AutomationControlled',
        ]
    });
    const page = await browser.newPage();
    
    // Переход на страницу и ожидание загрузки всего контента
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Получение отрендеренного HTML-кода
    const html = await page.content(); 
    await browser.close();
    
    return html;
}

try {
    const html = await getPrerenderedHTML(
        'https://zakupki.gov.ru/epz/order/extendedsearch/results.html?morphology=on&search-filter=%D0%94%D0%B0%D1%82%D0%B5+%D1%80%D0%B0%D0%B7%D0%BC%D0%B5%D1%89%D0%B5%D0%BD%D0%B8%D1%8F&pageNumber=1&sortDirection=true&recordsPerPage=_10&showLotsInfoHidden=false&sortBy=PUBLISH_DATE&fz44=on&fz223=on&af=on&currencyIdGeneral=-1&applSubmissionCloseDateFrom=28.06.2026&okpd2IdsWithNested=on&okpd2Ids=8874711%2C8876117%2C8876110&okpd2IdsCodes=63.12%2C62.09.2%2C62.01.1'
    );

    console.log(html)
} catch (err) {
    console.log(`Не удалось проиндексировать страницу: ${err}`)
}

// module.exports = Indexer