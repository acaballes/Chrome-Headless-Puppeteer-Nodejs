## Chrome-Headless-Puppeteer-Nodejs
A simple web scraping using chrome headless + puppeteer + nodejs

For the sake of this example, this will only scrape facebook.com people search initial result.

## Pre-requisite
```
git
nodejs
npm
puppeteer
```

## Install
```
cd to/your/favorite/path
git clone https://github.com/acaballes/Chrome-Headless-Puppeteer-Nodejs.git
cd to/your/cloned/folder/path
vi login_credential.js OR nano login_credential.js

Paste the code and fill in your facebook login credential andd save it:
    module.exports = {
        username: '',
        password: ''
    }
    
run "nodejs index.js"
```

## Features for this example
```
Login to facebook site
People search - in my example I set 'kevin' as the keywork search
Take a webpage screenshot
```

## Tips

I set the option 'headless' to 'false' just for visual debugging. You can make it to 'true' but there may be additional option will be required depends on the website you access.
```
    const browser = await puppeteer.launch({
        headless: false //set to false for visual debugging
    });

```
