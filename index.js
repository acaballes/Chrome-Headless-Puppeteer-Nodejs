const puppeteer = require('puppeteer');
const CREDS = require('./login_credential');

/*** CRAWLING BEGINS ***/
async function letsCrawl() {
    console.log('Crawling begin...');

    const browser = await puppeteer.launch({
        headless: false 
    });
    const page = await browser.newPage();
    await loginToFaceBook(page);
    await searchPerson(page);
}

/*** INITIATE/SIMULATE LOGIN TO FACEBOOK ***/
async function loginToFaceBook(page) {
    console.log('Logging in to facebook with username: '+CREDS.username+ ' password: '+CREDS.password);

    const USERNAME_SELECTOR = '#email';
    const PASSWORD_SELECTOR = '#pass';
    const BUTTON_SELECTOR = '#loginbutton';
    await page.goto('https://www.facebook.com/');
    //simulate log in
    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(CREDS.username);
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.password);
    await page.click(BUTTON_SELECTOR);
    await page.waitForNavigation();

    console.log('Successfully logged in to facebook!');
}

/*** SIMULATE A SEARCH IN FACEBOOK SEARCH ***/
async function searchPerson(page) {
    const KEYWORD = 'kevin';
    const SEARCH_URL = 'https://www.facebook.com/search/top/?q='+KEYWORD;
    
    console.log('Searching for a person named: '+KEYWORD);

    await page.goto(SEARCH_URL);
    await page.waitFor(3*1000);

    // we will scrape/get all the full names from the results
    scrapeFullNameFromTheResults(page); 
}

/*** LETS GET ALL RESULTS FULLNAME ***/
async function scrapeFullNameFromTheResults(page) {
    // this is the list wrapper selector for each result
    const RESULT_LIST_CLASS_SELECTOR = "_2yer _401d _2xje _2nuh";

    // lets first evaluate and see the search result length
    let resultLength = await page.evaluate((sel) => {
        return document.getElementsByClassName(sel).length;
    }, RESULT_LIST_CLASS_SELECTOR);
    let resultcount = resultLength;

    console.log('Search results: '+ resultcount);
    console.log('*** Getting the fullnames ***');

    // lets get each result wrapped content
    for (let i = 1; i <= resultLength; i++) {
        let fullname = await page.evaluate((sel) => {
            return document.querySelector(sel);
        }, '#initial_browse_result > div#xt_uniq_3');
        //let fn = document.getElementById("#js_4c").innerHTML;	
	console.log(i+'. '+fullname);
    }
}

async function takeScreenshot(url, filename) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({ path: 'screenshots/'+filename+'.png' });
  browser.close();
}

letsCrawl();
