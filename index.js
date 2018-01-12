const puppeteer = require('puppeteer');
const CREDS = require('./login_credential');

/*** CRAWLING BEGINS ***/
async function letsCrawl() {
    console.log('Crawling begin...');

    const browser = await puppeteer.launch({
        headless: false //set to false in order to see how the operation goes
    });
    const page = await browser.newPage();
    await loginToFaceBook(page);
    await searchPerson(page, browser);
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
async function searchPerson(page, browser) {
    const KEYWORD = 'kevin';
    const SEARCH_URL = 'https://www.facebook.com/search/people/?q='+KEYWORD;
    
    console.log('Searching for a person named: '+KEYWORD);

    await page.goto(SEARCH_URL);
    await page.waitFor(5*1000);

    //take a screenshot
    takeScreenshot(SEARCH_URL, 'fb-'+KEYWORD);
    // we will scrape/get all the full names from the results
    scrapeFullNameFromTheResults(page, browser); 
}

/*** LETS GET ALL RESULTS FULLNAME ***/
async function scrapeFullNameFromTheResults(page, browser) {
    // this is the list wrapper selector for each result
    const CONTAINER_SELECTOR = "BrowseResultsContainer";

    // lets first evaluate and see the search result length
    let resultLength = await page.evaluate((sel) => {
        return document.getElementById(sel).childNodes.length;
    }, CONTAINER_SELECTOR);
    let resultcount = resultLength;

    console.log('Search results: '+ resultcount);
    console.log('*** Getting the fullnames from search result ***');

    // lets get each result wrapped content
    for (let i = 1; i <= resultLength; i++) {
        let fullname = await page.evaluate((sel) => {
            return document.querySelector(sel).innerHTML;
	}, '#' +CONTAINER_SELECTOR+ ' > div:nth-child(' +i+ ') > div > div > div > div > div > div > div > div:nth-child(2) > div > div > div > a > span');

	// lets display each fullname that we scraped!
	console.log(i+'. '+fullname);
    }

    //lets close the browser
    browser.close();
}

async function takeScreenshot(url, filename) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({ path: 'screenshots/'+filename+'.png' });
    browser.close();
}

letsCrawl();
