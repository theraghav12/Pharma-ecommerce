// Script to fetch the first image URL for a medicine using Puppeteer and Google Images
// Usage: node puppeteerImageFetcher.js "Medicine Name"

import puppeteer from 'puppeteer';

async function getImageUrl(query) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('https://www.google.com/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('input[name="q"]', { timeout: 7000 });
    await page.type('input[name="q"]', query);
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    // Wait for Images tab and click it
    await page.waitForXPath("//a[contains(text(),'Images')]", { timeout: 7000 });
    const [imagesTab] = await page.$x("//a[contains(text(),'Images')]");
    if (imagesTab) {
      await imagesTab.click();
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    } else {
      console.error('Images tab not found');
      return null;
    }
    // Wait for images to load
    await page.waitForSelector('img', { timeout: 7000 });
    await page.waitForTimeout(2000);
    // Get the first valid image src
    const imageUrl = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      for (const img of imgs) {
        if (img.src && img.src.startsWith('http') && !img.src.includes('gstatic.com')) {
          return img.src;
        }
      }
      return null;
    });
    return imageUrl;
  } catch (err) {
    console.error('Error fetching image:', err);
    return null;
  } finally {
    await browser.close();
  }
}

// CLI usage
if (process.argv.length >= 3) {
  const query = process.argv.slice(2).join(' ');
  getImageUrl(query).then(url => {
    if (url) {
      console.log('Image URL:', url);
    } else {
      console.log('No image found.');
    }
  });
}

export default getImageUrl;
