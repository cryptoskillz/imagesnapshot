const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');

module.exports = {
  async fetch(request) {
    try {
      const executablePath = await chromium.executablePath;

      const browser = await puppeteer.launch({
        executablePath,
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        headless: chromium.headless,
      });

      const page = await browser.newPage();
      await page.goto('https://example.com');

      // Perform any necessary operations with puppeteer

      await browser.close();

      return new Response('Success');
    } catch (error) {
      console.error(error);
      return new Response('Error', { status: 500 });
    }
  },
};
