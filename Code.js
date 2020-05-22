function getStockPrices() {
    const symbol = 'TWLO'
    
    const api_key = PropertiesService.getScriptProperties().getProperty("api_key")
    
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${api_key}`
    
    const response = UrlFetchApp.fetch(url).getContentText()
    
    const jsonParsed = JSON.parse(response)
    
    const todaysDate = getTodaysDate()
    
    const desiredData = jsonParsed["Time Series (Daily)"][todaysDate]
    
   sendSms(symbol, desiredData)
}

function sendSms(symbol, body) {
  
  const accountSID = PropertiesService.getScriptProperties().getProperty("ACCOUNT_SID")
  
  const authToken = PropertiesService.getScriptProperties().getProperty("AUTH_TOKEN")
  
  const messages_url = `https://api.twilio.com/2010-04-01/Accounts/${accountSID}/Messages.json`

  const payload = {
    "To": "YOURPHONENUMBER",
    "Body" : `Daily Report for ${symbol} in USD:
Open ${parseFloat(body["1. open"]).toFixed(2)}
High ${parseFloat(body["2. high"]).toFixed(2)}
Low ${parseFloat(body["3. low"]).toFixed(2)}
Close ${parseFloat(body["4. close"]).toFixed(2)}
Traded Volume ${parseInt(body["5. volume"])}`,
    "From" : "YOURTWILIONUMBER"
  }

  const options = {
    "method" : "post",
    "payload" : payload
  }

  options.headers = { 
    "Authorization" : "Basic " + Utilities.base64Encode(accountSID+":"+authToken)
  }

  UrlFetchApp.fetch(messages_url, options);
  
  console.log("SMS sent")
}


function getTodaysDate(){
    let today = new Date()
    
    let dd = today.getDate()
    
    let mm = today.getMonth() + 1 //January is 0
    
    let yyyy = today.getFullYear()
    
    // to add 0 in the beggining of day & month e.g to change 9 to 09
    
    if (dd < 10) {
      dd = '0' + dd
    }
    
    if (mm < 10) {
      mm = '0' + mm
    }
    
    today = yyyy + '-' + mm + '-' + dd
    
    return today
}