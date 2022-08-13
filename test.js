import puppeteer from "puppeteer"
import fs from "fs"

const waitTillHTMLRendered = async (page, timeout = 30000) => {

    if (page == `` || page == null) {
      throw error(`Html Page is Not Defined`)
    }
    const checkDurationMsecs = 1000;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 3;
  
    while (checkCounts++ <= maxChecks) {
  
      let html = await page.content();
  
      let currentHTMLSize = html.length;
  
      let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);
  
      //  console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize);
  
      if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
        countStableSizeIterations++;
      else
        countStableSizeIterations = 0; //reset the counter
  
      if (countStableSizeIterations >= minStableSizeIterations) {
        //   console.log("Page rendered fully..");
  
        break;
      }
  
      lastHTMLSize = currentHTMLSize;
  
      await page.waitForTimeout(checkDurationMsecs)
    }
  };


  const webScrapYandex =async (prompt) =>{

   




    let browser = await puppeteer.launch({
        args: [
          '--disable-dev-shm-usage',
          `--disable-site-isolation-trials`,
           `--no-sandbox`,
         '--disable-setuid-sandbox',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--lang="en-US"',
      
          `--disable-web-security`,
      
       
          `--disable-application-cache`,
          '--disable-features=IsolateOrigins,site-per-process',
          '--flag-switches-begin --disable-site-isolation-trials --flag-switches-end',
          '--enable-automation',
        //   '--window-size=1000,1000'
      
        ],
        
        headless: false
      }
      )
    let [page] = await browser.pages();
      await page.goto("https://yandex.com.tr/", {
        waitUntil: 'networkidle2'
    })
    await page.setViewport(
        {width:1500,
        height:1000}
    )
     await page.waitForSelector(`#text`)
     await page.type(`#text`,`${prompt}`)
     await page.keyboard.press('Enter')
await page.waitForNetworkIdle()
     await waitTillHTMLRendered(page)
    
     let  pagenation=  await page.$eval(`.pager__items`, (element) => {
        return element.innerHTML
      })
    
     let pageBodyTextContent , pageTextContentBigData
    
    while(pagenation.includes(`sonraki`)){
    
        try{
        
            await waitTillHTMLRendered(page)  // sayfa tam yuklenmesi icin.
            page.waitForTimeout(1000)
            pagenation=  await page.$eval(`.pager__items`, (element) => {
                return element.innerHTML
              })

              pageBodyTextContent =  await page.$eval(`body`, (element) => {
                return element.innerText
              })
              
         
        
             pageTextContentBigData += pageBodyTextContent
          
            
          
            await page.click(`body > div.main.serp.i-bem > div.main__center > div.main__content > div.content.i-bem > div.content__left > div.pager.i-bem > div > a.link.link_theme_none.link_target_serp.pager__item.pager__item_kind_next.i-bem`)
             await page.waitForTimeout(1000)
        }
        catch(err){
         console.log(err)
            pagenation= ``
        }
    
    }
    
    await  browser.close()

    return pageTextContentBigData
    
    }

    
    webScrapYandex(`" teknopark yazılım bilgi  istanbul email address \"info\"",`)