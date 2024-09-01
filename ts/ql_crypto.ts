/*
  cron: 0 9 * * *
  new Env('CMC Crypto')

  环境变量:
  export CMC_API_KEY ='xxxxx'

  详情参考： https://coinmarketcap.com/api/documentation/v1/
 */

import { sendNotify } from '../utils';

const symbolMap = {
  USD: '$',
  JPY: '円'
}


async function notify(msg: string, title = 'Crypto') {
  await sendNotify(title, msg, { notifyType: 2, exit: false, isPrint: true });
}

async function start() {
  const apiKey = (process.env.CRYPTO_API_KEY)
  if (!apiKey) {
    return console.log('not api key')
  }
  function genHeaders() {
    return {
      authorization: `Apikey ${apiKey}`,
      Accept: 'application/json'
    }
  }
  const headers = genHeaders()

  const priceList = await getSymbolsPrice(headers, ['BTC', 'ETH', 'SOL'])
  console.log(`发送通知: 币价信息`)
  let priceMsg = `==========币价信息==========\n`
  priceMsg += priceList.join('\n')
  await notify(priceMsg, `币价信息`)

  const topsList = await getTopMktcap(headers)
  console.log(`发送通知: 市值排行`)
  let topsMsg = `==========市值排行==========\n`
  topsMsg += topsList.join('\n')
  await notify(topsMsg, '市值排行')

  // console.log(topsList)
  // const newsList = await geCryptoNews(headers)
  // console.log(`发送通知: news`)
  // let newsMsg = `========== news ==========\n`
  // newsMsg += newsList.join('\n')
  // await notify(newsMsg, '市值排行')

}

// Multiple Symbols Price 多个币种价格
function getSymbolsPrice(headers: RequestInit["headers"], symobls: string[] = []) {
  // https://min-api.cryptocompare.com/documentation?key=Price&cat=multipleSymbolsPriceEndpoint
  const qrSearch = new URLSearchParams({
    fsyms: symobls.join(','),
    tsyms: ['USD', 'JPY'].join(',')
  })
  const apiUrl = 'https://min-api.cryptocompare.com/data/pricemulti'
  return fetch(`${apiUrl}?${qrSearch.toString()}`, {
    headers
  }).then((res) => {
    return res.json()
  }).then((data) => {
    const res = Object.keys(data).map((symbol) => {
      let text = `${symbol}: `
      const symbolData = data[symbol]
      Object.keys(symbolData).forEach((unit) =>{
        const symbolUnit = (symbolMap as any)[unit] || ''
        const price = symbolData[unit]
        text += `${symbolUnit}${price} `
      })
      // text += `${text}\n`
      return text
    })
    return res
  }).catch(err => {
    console.log(err)
    return []
  })
}


function geCryptoNews(headers: RequestInit["headers"]) {
  // https://min-api.cryptocompare.com/data/v2/news/?lang=EN
  const qrSearch = new URLSearchParams({
    lang: ['EN'].join(','),
  })
  const apiUrl = 'https://min-api.cryptocompare.com/data/v2/news/'
  return fetch(`${apiUrl}?${qrSearch.toString()}`, {
    headers
  }).then((res) => {
    return res.json()
  }).then((data) => {
    // console.log(data)
    const newsData = data?.Data || []
    const res = newsData.map((item: any, index: number) => {
      const body = item.body
      const title = item.title
      const url = item.url
      // text += `${text}\n`
      return `${index + 1}. ${title}\n ${body}\n url: ${url}`
    })
    return res
  }).catch(err => {
    console.log(err)
    return []
  })
}


// function getToplists(headers: RequestInit["headers"]) {

//   return getTopMktcap(headers)

//   // 24交易量
//   // https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD
//   // const qrSearch = new URLSearchParams({
//   //   limit: '10',
//   //   tsym: 'USD'
//   // })
//   // const apiUrl = 'https://min-api.cryptocompare.com/data/top/totalvolfull'
//   // return fetch(`${apiUrl}?${qrSearch.toString()}`, {
//   //   headers
//   // }).then((res) => {
//   //   return res.json()
//   // }).then((data) => {
//   //   // console.log(data)
//   //   const newsData = data?.Data || []
//   //   const res = newsData.map((item: any, index: number) => {
//   //     const body = item.body
//   //     const title = item.title
//   //     const url = item.url
//   //     // text += `${text}\n`
//   //     return `${index + 1}. ${title}\n ${body}\n url: ${url}`
//   //   })
//   //   return res
//   // }).catch(err => {
//   //   console.log(err)
//   //   return []
//   // })
// }

function getTopMktcap (headers: RequestInit["headers"]) {
  // 市值排行
  // https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD
  const qrSearch = new URLSearchParams({
    limit: '20',
    tsym: 'USD'
  })
  const apiUrl = 'https://min-api.cryptocompare.com/data/top/mktcapfull'
  return fetch(`${apiUrl}?${qrSearch.toString()}`, {
    headers
  }).then((res) => {
    return res.json()
  }).then((data) => {
    // console.log(data)
    const newsData = data?.Data || []
    // console.log(newsData)
    const res = newsData.map((item: any, index: number) => {
      const coin = item.CoinInfo
      // const raw = item.RAW
      const display = item.DISPLAY
      // K千--M(million)百万--B(billion) 十亿
      // /${raw.USD.MKTCAP}
      return `${coin.Name}: create ${coin.AssetLaunchDate}, 市值${display.USD.MKTCAP.replace(/\s/g, '')}`
    })
    // console.log(res)
    return res
  }).catch(err => {
    console.log(err)
    return []
  })
}


start().finally(() => process.exit());


