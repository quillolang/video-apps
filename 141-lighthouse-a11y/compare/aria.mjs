// What a screen reader is told about a page: its accessibility tree, as Playwright's ARIA snapshot gives it (each
// element's role and name), once the page has loaded.
//   node aria.mjs http://localhost:8081/
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 640, height: 600 } });
await page.goto(process.argv[2]);
await page.waitForLoadState('networkidle');
console.log(await page.locator('body').ariaSnapshot());
await browser.close();
