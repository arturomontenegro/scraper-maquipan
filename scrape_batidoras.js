const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.ventuscorp.cl/linea-panaderia/batidoras');

  await page.waitForSelector('.product-item');

  const productos = await page.$$eval('.product-item', items => {
    return items.map(item => {
      const nombre = item.querySelector('h2')?.innerText.trim() || '';
      const precio = item.querySelector('.price')?.innerText.trim() || '';
      return { nombre, precio };
    });
  });

  console.log(productos);
  fs.writeFileSync('batidoras.json', JSON.stringify(productos, null, 2));
  await browser.close();
})();
