import puppeteer from "puppeteer"
import fs, { readFileSync } from "fs"

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


const webScrapGoogle =async (prompt) =>{


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
  await page.goto("https://www.google.com/", {
    waitUntil: 'networkidle2'
})
await page.setViewport(
    {width:1500,
    height:1000}
)
if (await page.$(`#L2AGLb > div`) != null) await page.click(`#L2AGLb > div`)



 await page.waitForSelector(`body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input`)
 await page.type(`body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input`,`${prompt}`)
 await page.keyboard.press('Enter')
 await page.waitForTimeout(1000)

 let  pagenation=  await page.$eval(`#botstuff > div > div:nth-child(3) > table > tbody > tr`, (element) => {
    return element.innerHTML
  })

 let pageBodyTextContent , pageTextContentBigData

 while(pagenation.includes(`Sonraki`)){



    try{
 
        pagenation=  await page.$eval(`#botstuff > div > div:nth-child(3) > table > tbody > tr`, (element) => {
            return element.innerHTML
          })
          await waitTillHTMLRendered(page) // sayfa tam yuklenmesi icin.

          pageBodyTextContent =  await page.$eval(`body`, (element) => {
            return element.innerText
          })
          
         pageTextContentBigData += pageBodyTextContent
        
 
        await page.click(`#pnnext`)
        await page.waitForTimeout(1000)
        
    }
    catch(err){
     
        pagenation= ``
    }

}

await  browser.close()

return pageTextContentBigData

}


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
            await page.waitForTimeout(2000)

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
       
            pagenation= ``
        }
    
    }
    
    await  browser.close()

    return pageTextContentBigData
    
    }

    
    

 const createListOfEmail = async (garbageData)=>{
        const regex = /([a-zA-Z0-9-]+@[a-zA-Z0-9-]+\.[a-zA-Z]+-?(\.[a-zA-Z]+))/g // tek datalarda global flagi kaldirmazssaniz hata alirsiniz
        let  cleanData = ``
       
        try{
             cleanData = fs.readFileSync(`./theList.txt`,cleanData,{encoding:"utf-8"})
            

             }
             catch{
               
             }
        
             
             let  theGarbageData =  cleanData + ` ---- `+ garbageData // burda temiz olanida ekliyip tekrar taratiyorum
         cleanData  =  await theGarbageData.match(regex) 

         for (let index = 0; index < cleanData.length; index++) {
          let temporaryItem =cleanData[index]
          cleanData =  cleanData.filter(filterItem=> filterItem != cleanData[index])
              cleanData.push(temporaryItem)
          
         }
          



        cleanData = cleanData.join(`,`)
        
        
        
        
        fs.writeFileSync(`./theList.txt`,cleanData,{encoding:"utf-8"})
        
        
        }

// ad bulmakta hep zorlaniyorum :D
const  scrapListFunc= async () =>{
const thePromptList = await JSON.parse(fs.readFileSync(`./src/config.json`,{"encoding":"utf-8"}))

console.log(thePromptList)
let  theWebScrappingListDatas 
for (let index = 0; index < thePromptList[0].searchSettings.length ; index++) {
   
try{
    console.log(`Scrapping: ${thePromptList[0].searchSettings[index]}`)
    theWebScrappingListDatas += await  webScrapGoogle(`${thePromptList[0].searchSettings[index]}`)
    theWebScrappingListDatas += await  webScrapYandex(`${thePromptList[0].searchSettings[index]}`)
    await createListOfEmail(theWebScrappingListDatas)
    
}
catch(e){
    console.log(e)
}

}

}

scrapListFunc()



// Izlediginiz icin tesekkurler.

//,info@metkansoft.com.tr

//info@mkm.com.tr,info@acibadem.com.tr,bilgi@beah.gov.tr