const { chromium } = require('playwright');
const fs = require('fs');
const XLSX = require('xlsx');

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

    const nombre = await page.$eval(
      '.vtex-store-components-3-x-productBrand',
      el => el.innerText.trim()
    );

    const precio = await page.$eval(
      '.vtex-product-price-1-x-sellingPriceValue span',
      el => el.innerText.trim()
    );

    const disponibilidad = await page.$eval(
      '.availability span',
      el => el.innerText.trim()
    ).catch(() => 'No especificado');

    const ivaIncluido = await page.$eval(
      '.vtex-store-components-3-x-taxInfo',
      el => el.innerText.trim()
    ).catch(() => 'No indica');

    let precioOriginal = '';
    let descuento = '';

    try {
      precioOriginal = await page.$eval(
        '.vtex-product-price-1-x-listPriceValue span',
        el => el.innerText.trim()
      );

      // Calcular descuento en porcentaje
      const valorOriginal = parseFloat(precioOriginal.replace(/[^\d]/g, ''));
      const valorOferta = parseFloat(precio.replace(/[^\d]/g, ''));
      const porcentaje = Math.round(((valorOriginal - valorOferta) / valorOriginal) * 100);
      descuento = `${porcentaje}%`;
    } catch (e) {
      descuento = 'Sin descuento';
    }

    resultados.push({
      url,
      nombre,
      precio,
      disponibilidad,
      ivaIncluido,
      descuento
    });
  }

  console.log(resultados);

  // Guardar JSON
  fs.writeFileSync('batidoras.json', JSON.stringify(resultados, null, 2));

  // Guardar Excel
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(resultados);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Batidoras');
  XLSX.writeFile(workbook, 'batidoras.xlsx');

  await browser.close();
})();
