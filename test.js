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


  const list = fs.readFileSync(`./theList.txt`,{encoding:"utf-8"})

  const regex = /([a-zA-Z0-9-]+@[a-zA-Z0-9-]+\.[a-zA-Z]+-?(\.[a-zA-Z]+))/g
  let clearData
  let dataArray   =  await list.match(regex) 
  console.log(dataArray.length)
dataArray.forEach((item,index)=>{

 dataArray =   dataArray.filter(filterItem => filterItem != item)
dataArray.push(item)

})

fs.writeFileSync(`./theList.txt`,dataArray.join(`,`),{encoding:"utf-8"})