var consts = {
  "getUserInfo":'https://solarity-server.herokuapp.com/api/users/',
  "roomVR":"https://solarity-stage.vercel.app/"
};

//////////////////////////- inject -//////////////////////////

function onExtMessage(message, sender, sendResponse){
  switch (message.command) {
    case "getTransaction":
      // fetch_custom(message.data, sender, sendResponse)
    break;
  }
  return true
}

chrome.runtime.onMessage.addListener(onExtMessage);

//  /////////////////////////////- bg.js -//////////////////////////////
var version = "2.0";
var uiSettings = {

};
var twitterApp = {
  onExtMessage: function(message, sender, sendResponse){ 
    twitterApp.message = message;
    switch (message.command) {
      case "getInfoByWalletAddress":
        twitterApp.getInfoByWalletAddress(message.data, sender, sendResponse)
        break;
      case "getAllTokenPrices":
        twitterApp.getAllTokenPrices(message.data, sender, sendResponse)
        break;
    }
    return true;
  },
  getAllTokenPrices:function(data, sender, sendResponse){
    var tokens=[{"type":'solana',"api":"https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"},{"type":"usdc","api":"https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=usd"}]

      var all_push_data_arr = [];
      var promise_all_urls_arr = [];
      for (var i = 0; i < tokens.length; i++) {
        var api = tokens[i]['api'];
        var type = tokens[i]['type'];
        promise_all_urls_arr.push(
          getProductReviewAsync(api,type)
          .then((apiResponse) => {
            all_push_data_arr.push(apiResponse);
          }) 
        );
      }
      Promise
      .all(promise_all_urls_arr)
      .then(() => {
        sendResponse(all_push_data_arr);
      }); 
  },
  getInfoByWalletAddress:function(address,sender, sendResponse){
    fetch('https://solarity-server.herokuapp.com/api/users/'+address)
      .then(async (response) => {
        var data = await response.json();
        sendResponse({
          'success':true,
          "solanaAddress" : data.user.solanaAddress,
          "response" : data.user.rooms,
          "username" : data.user.username
        });
      })
      .catch((error) => {
        sendResponse({
          'success':false,
          "response" : error.message
        });
      })
  }  
};

function getProductReviewAsync(api, type) {
  return new Promise(async (resolve, reject) => {
    var data = await fetch(api);
    var data_json = await data.json();
    var rs = {'type': type, 'result': data_json}
    resolve(rs);
  });
}

chrome.runtime.onMessage.addListener(twitterApp.onExtMessage);
// //twitterApp.load();

function sendMessage2(tabId, msg){
  if(tabId) chrome.tabs.sendMessage(tabId, msg);
  else chrome.runtime.sendMessage(sender.id, msg);
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  sendMessage2(tabId, {"command": "initTwitterBtns"});
});

