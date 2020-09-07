const puppeteer = require('puppeteer')
const fs = require("fs-extra")

const url = 'https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/'

const main = async() => {
    try {
        // initialize
        const browser = await puppeteer.launch({headless: true})
        const page = await browser.newPage()

        page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.0 Safari/537.36')
        
       
        
        // open and wait for apear
        await page.goto(url)
        await page.waitForSelector('.section--panel--1tqxC')
        // get necessary section
        const firstSection = (await page.$$('.section--panel--1tqxC'))[0]// $ - get one el, $$ get all
        const contentSection = await firstSection.$$('ul.unstyled-list')

        // initialize file
        fs.writeFile('data.csv', 'title, time\n')
        let data = []

        for (let i = 0; i < contentSection.length; i++){
            // ! title, time
            // get text from tags by innetTEXT
            const title = await contentSection[i].$eval('.section--lecture-title-and-description--3lul7 > span', title => title.innerHTML)
            const time = await contentSection[i].$eval('.section--lecture-content--2I4Bi', time => time.innerHTML)
            // convert to more usefull format
            Date.parse(time)
            // store data
            data.push({title, time})
            
            // ! video
            //  TODO must be protaction from parsing
            // const videoButton = await contentSection[i].$('button')
            // if(videoButton){
            
            //     videoButton.click()
            //     await page.waitForSelector('video[src]')
            //     const videoSrc = await page.$eval('video[src]', video => video.getAttribute('src')) 
            //     console.log(videoSrc); 
            // }
            
        }
        
        
        data.sort((a, b) => {
            return( a.time > b.time ? 1 : -1 )
        })
        // write data to file
        data.forEach(el => (fs.appendFile("data.csv",`"${el.title}", "${el.time}"\n` )))
   
        console.log("DONE!");
        await browser.close()
        // CLOSE
    } catch (error) {
         console.log(error);
    }
}
// !run function 
main()