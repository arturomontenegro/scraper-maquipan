const { chromium } = require('playwright');
const fs = require('fs');

const urls = [
  'https://www.ventuscorp.cl/batidora-industrial-10-lts-vb-10-ventus/p',
  'https://www.ventuscorp.cl/batidora-industrial-20-lts-vb-20-ventus/p',
  'https://www.ventuscorp.cl/batidora-industrial-30-lts-vb-30-ventus/p'
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const resultados = [];

  for (const url of urls) {
    await page.goto(url, { timeout: 60000 });
    await page.waitForSelector('.vtex-store-components-3-x-productBrand');

    const nombre = await page.$eval('.vtex-store-components-3-x-productBrand', el => el.innerText.trim());
    const precio = await page.$eval('.vtex-product-price-1-x-sellingPriceValue span', el => el.innerText.trim());

    resultados.push({ url, nombre, precio });
  }

  console.log(resultados);
  fs.writeFileSync('batidoras.json', JSON.stringify(resultados, null, 2));

  await browser.close();
})();
