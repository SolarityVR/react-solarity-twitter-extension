/*global chrome*/
/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer }from 'react-frame-component';
import { useEffect, useState } from "react";
import { PublicKey, Transaction } from "@solana/web3.js";
import $ from 'jquery'; 
import App from "./App";
import AppW from "./App.test";
import { payIcon, roomIcon } from './icons'
import * as web3 from '@solana/web3.js';

var settings={
  solana:0,
  usdc:0,
  verse:0
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // listen for messages sent from background.js
    if (request.command === 'initTwitterBtns') {
      if(window.locationUrl != undefined && window.locationUrl == window.location.href) {
        return;
      }
      window.locationUrl = window.location.href;
      setTimeout(function(){
        startchekingTwitter();
      }, 1000);
    }
});

class Main extends React.Component {

  render() {
    return <App/> 
  }
}


var solanaAddress='';
/*<script> var exports = {}; </script>*/

var txt = "var exports = {};";
addJS( txt );

var B = document.createElement('script');
B.src = chrome.runtime.getURL('/app/bundle.js');
B.onload = function() {
  var w = document.createElement('script');
  w.src = chrome.runtime.getURL('/app/index.iife.js');
  w.onload = function() {
    this.remove();
    var spl = document.createElement('script');
    spl.src = chrome.runtime.getURL('/app/spl_token.js');
    spl.onload = function() {
      var s = document.createElement('script');
      s.src = chrome.runtime.getURL('/app/background.js');
      s.onload = function() {
        this.remove();
      };
      (document.head || document.documentElement).appendChild(s);
    };
    (document.head || document.documentElement).appendChild(spl);
  };
  (document.head || document.documentElement).appendChild(w);  
};
(document.head || document.documentElement).appendChild(B);


const app = document.createElement('div');
app.id = "twitter-pay-extension-root"; 
document.body.appendChild(app);
ReactDOM.render(<Main />, app);

const appmodal = document.createElement('div');
appmodal.id = "twitter-extension-modal"; 
document.body.appendChild(appmodal);
ReactDOM.render(<div class="modal">
  <div class="modal-content">
  <span class="close-button">×</span>
  <div class="modal-container">

  </div>
  </div>
  </div>, appmodal);


initEvents();
app.style.display = "none";

var list =[];

async function addTwitterBtn() {

  $('nav[aria-label="Profile timelines"]').each(function (index) {
    $(this).parent().attr('addition','pay');
  });
  $('.btn-twitter-exts').remove();
  var payBtn = $(`<div class="btn-twitter-exts css-1dbjc4n r-obd0qt r-18u37iz r-1w6e6rj r-1h0z5md r-dnmrzs" style="margin-bottom: 14px;margin-right:8px;cursor:pointer;" title="PAY">`+payIcon+`</div>`);

  var roomBtn = $(`<div class="btn-twitter-exts css-1dbjc4n r-obd0qt r-18u37iz r-1w6e6rj r-1h0z5md r-dnmrzs" style=" margin: 0px 8px 14px 0px;cursor:pointer" title="ROOM">`+roomIcon+`</div>`);

  var viewBtn = $(`<div class="btn-twitter-exts css-1dbjc4n r-obd0qt r-18u37iz r-1w6e6rj r-1h0z5md r-dnmrzs" style=" margin: 0px 8px 14px 0px;cursor:pointer;color:#f2f2f2;" title="VIEW">`+'<svg xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px;padding: 4px;" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>'+`</div>`)
  $(roomBtn).click(function (e) {
    var twitter_name = parseUsername(window.location.href);
    if ($('.modal-container ul li').length == 0) {
      initModalBox();
    } else {
      $('body').append('<div class="cover"> loading...</div>');
      getUserInfo(twitter_name,true);
      //initModalBox();
    }
  });

  $(payBtn).click(function (e) {

    if ($('.cover').length == 0) {
      $('body').append('<div class="cover"> loading...</div>');  
    }
    var event = new CustomEvent('RecieveContent', {detail:  "connect-wallet"});
    window.dispatchEvent(event);
  });

  $(viewBtn).click(function(e) {
    showVrBanner("https://main.d2rg0l816a56cd.amplifyapp.com/iframe/joinModal/plaza");
  })
  
  /*Check for profile page*/

  // if(document.querySelector("title")) {
  //   if(document.querySelector("title").innerText.match(/(?<=\(@).*(?=\))/)) {
  //     let people_username = document.querySelector("title").innerText.match(/(?<=\(@).*(?=\))/)[0]
  //     let own_username = document.querySelector('[aria-label="Account menu"]').innerText.match(/(?<=@).*/)[0]
  //     if (document.querySelector('meta[content="profile"]') && !document.querySelector(".btn-twitter-exts") && people_username == own_username) {
  //       $("div[data-testid='primaryColumn']").find("div:not([addition='pay']) > a[data-testid*='editProfileButton']").before(payBtn);
  //       $("div[data-testid='primaryColumn']").find("div:not([addition='pay']) > a[data-testid*='editProfileButton']").before(roomBtn);
  //     }      
  //   }
  // }
  // $('body .buttons').append(payBtn);
  // $('body .buttons').append(roomBtn);
  // $('body .buttons').append(viewBtn);
  //others profile
  $("div[data-testid='primaryColumn']").find("div:not([addition='pay']) > div[data-testid*='follow']").closest('[data-testid="placementTracking"]').before(payBtn);
  $("div[data-testid='primaryColumn']").find("div:not([addition='pay']) > div[data-testid*='follow']").closest('[data-testid="placementTracking"]').before(roomBtn);
  $("div[data-testid='primaryColumn']").find("div:not([addition='pay']) > div[data-testid*='follow']").closest('[data-testid="placementTracking"]').before(viewBtn);
  //your profile
  $('a[data-testid="editProfileButton"]').before(payBtn);
  $('a[data-testid="editProfileButton"]').before(roomBtn);
  $('a[data-testid="editProfileButton"]').before(viewBtn);

  initEvents()
  var twitter_name = parseUsername(window.location.href)
  getUserInfo(twitter_name,false); //default room loaded from here
}

function getUserInfo(twitter_name,modal){
  sendMessage({"command": "getInfoByWalletAddress","data":twitter_name},function(result){
    if(chrome.runtime.lastError) {
      setTimeout(getUserInfo, 50, twitter_name, modal);
    } else {
      $('body').find('.cover').remove();
      if (result.success) {
        if(localStorage.getItem('solarity-selected-room-index') == undefined) {
          localStorage.setItem('solarity-selected-room-index', 0);
        }
        var data=result.response;
        var list = `<ul class="list-group">`;
        for (var i = 0; i < data.length; i++) {
          var title = data[i]['title'];
          var roomId = data[i]['_id'];
          var VR = 'https://main.d2rg0l816a56cd.amplifyapp.com/'+result.username+'/room'+data[i]['roomNo']+'/'+roomId;
          var selcted_room = i == localStorage.getItem('solarity-selected-room-index') ? 'room-selected' : '';
          var roomVrFrame = `<a  href="javascript:;" class="buttonRoomSolana" roomIndex="${i}" vr=`+VR+`>`+title+`</a>`;
          list +=`<li class="`+selcted_room+`">`+roomVrFrame+`</li>`
        }
  
        if (data.length != 0) {
          if(parseUsername(window.location.href) == "oraziogrinzosih") {
          var VR = 'https://main.d2rg0l816a56cd.amplifyapp.com/'+result.username+'/hub/';
          // var selcted_room = -1 == localStorage.getItem('solarity-selected-room-index') ? 'room-selected' : '';
          var roomVrFrame = `<a  href="javascript:;" class="buttonRoomSolana" roomIndex="-1" vr=`+VR+`>Money Boy Hub</a>`;
            list +=`<li>`+roomVrFrame+`</li>`
          }
          list +=`</ul>`;
          $('.modal-container').html(list);
          var defaultRoom = $('.modal-container ul li:eq(0)').find('a').attr('vr');
          if(modal == false) {
            showVrBanner(defaultRoom);
          }
        }else{
          var errorHtml = `<h4><strong><a href="https://main.d2rg0l816a56cd.amplifyapp.com/" target="_blank">Create a profile on our website</a></strong></h4>
          <div class="error">You don't have rooms available!!</div>`;
          $('.modal-container').html(errorHtml);  
        }
      } else {
        if(twitter_name == "SolanaMoneyBoys") {
          var list = `<ul class="list-group">`;
          var VR = 'https://main.d2rg0l816a56cd.amplifyapp.com/oraziogrinzosih/hub/';
          var selcted_room = -1 == localStorage.getItem('solarity-selected-room-index') ? 'room-selected' : '';
          var roomVrFrame = `<a  href="javascript:;" class="buttonRoomSolana" roomIndex="-1" vr=`+VR+`>Money Boy Hub</a>`;
            list +=`<li class="`+selcted_room+`">`+roomVrFrame+`</li>`
          list +=`</ul>`;
          $('.modal-container').html(list);
          var defaultRoom = $('.modal-container ul li:eq(0)').find('a').attr('vr');
          if(modal == false) {
            showVrBanner(defaultRoom);
          }
        } else if (twitter_name == "Solarity_VR") {
          var list = `<ul class="list-group">`;
          var VR = 'https://main.d2rg0l816a56cd.amplifyapp.com/frames/plaza';
          var selcted_room = -1 == localStorage.getItem('solarity-selected-room-index') ? 'room-selected' : '';
          var roomVrFrame = `<a  href="javascript:;" class="buttonRoomSolana" roomIndex="-1" vr=`+VR+`>Money Boy Hub</a>`;
            list +=`<li class="`+selcted_room+`">`+roomVrFrame+`</li>`
          list +=`</ul>`;
          $('.modal-container').html(list);
          var defaultRoom = $('.modal-container ul li:eq(0)').find('a').attr('vr');
          if(modal == false) {
            showVrBanner(defaultRoom);
          }
        } else {
          var errorHtml = `<h4><strong><a href="https://main.d2rg0l816a56cd.amplifyapp.com/" target="_blank">Create a profile on our website</a></strong></h4>
          <div class="error">`+result.response+`</div>`;
          $('.modal-container').html(errorHtml);
        }
      }
      initEvents();    
      if (modal) {
        initModalBox();  
      }
    }
  })

}

function toggleModal() {
  var modal = document.querySelector(".modal");
  modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
 var modal = document.querySelector(".modal");
 if (event.target === modal) {
  toggleModal();
}
}

function initModalBox(){
  var modal = document.querySelector(".modal");
  var closeButton = document.querySelector(".close-button");
  modal.classList.toggle("show-modal");

  closeButton.addEventListener("click", toggleModal);
  window.addEventListener("click", windowOnClick);

}
function showVrBanner(vr){
  var VR = vr;
  var vrFrame=`<iframe frameborder="0" src="`+VR+`" featurepolicy='{"vr": ["*"]}' allow="camera;microphone;vr;" scrolling="no" width="100%" height="100%"></iframe>`;
  var carousel= `<div class="slider">
  <ul><li class="c"> `+vrFrame+` </li></ul></div>`;
  //show room crausal here
  var injectNode = $('a[href$="/header_photo"]');
  $('.slider').remove();
  $(injectNode).children().remove();
  injectNode.prepend(carousel);
  initEvents();
}

function initEvents(){
  $('a[href$="/header_photo"]').on('click', function(e) {
    e.preventDefault(); 
  });

  $('.buttonRoomSolana').off().on('click', function(e) {
    var vr = $(this).attr('vr');
    var index = $(this).attr('roomIndex');
    localStorage.setItem('solarity-selected-room-index', index);
    toggleModal();
    $('.modal-container ul li').removeClass('room-selected');
    $(this).closest('li').addClass('room-selected');
    showVrBanner(vr);
  });

  $('.a-c-sign').keyup(function() {
    $(this).css('width', ($(this).val().length*30)+'px')
    
  });

  $('.btn-c-select').off().on('click', function(e) {
    const svg = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-check">
    <path d="M10 3L4.5 8.5L2 6" stroke="#1149FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>`;
    $('.btn-c-select').find('.svg-check').remove();
    $(this).append(svg);
  });


}

function startchekingTwitter(){
  addTwitterBtn();
}
function parseUsername(url)
{
  let output = url;
  let matches;

  // Parse username
  matches = url.match(/(?:https?:\/\/)?(?:www.)?(?:twitter|medium|facebook|vimeo|instagram)(?:.com\/)?([@a-zA-Z0-9-_]+)/im);
  // Set output
  output = !!matches && matches.length ? matches[1] : output;
  
  return output;
}
// startchekingTwitter();


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action") {
      initModalBoxPay();
    }
  }
  );
function initModalBoxPay(isPay){
  app.style.display = "block";
  $('.xl.block').removeClass('disaled-pay')
  if (isPay == '') {
    $('.send-username').html('Send to ' + parseUsername(window.location.href))
    $('#solarity-extension-payment').show();
  } else {
    $('.xl.block').addClass('disaled-pay');
    $('.send-username').html(`<div style="color:red;">`+isPay+' '+parseUsername(window.location.href)+`</div>`)
    $('#solarity-extension-payment').show();
  }
}

function getUserInfoForPay(){
  sendMessage({"command": "getInfoByWalletAddress","data":parseUsername(window.location.href)},function(result){
    if(chrome.runtime.lastError) {
      setTimeout(getUserInfoForPay, 50);
    } else {
      $('body').find('.cover').hide();
      if (result.success) {
        solanaAddress=result.solanaAddress;
        initModalBoxPay('');
      } else {
        initModalBoxPay('You Can\'t pay to');
      }
      initEvents();    
    }
  })
}

window.addEventListener('RecieveContentApp', function(evt) {
   if (evt.detail.msg == "pay-wallet") {

    var event = new CustomEvent('RecieveContent', {detail: { 'msg': "made-transaction", amoutn:evt.detail.amount,currency:evt.detail.currency,solanaAddress:solanaAddress }});
    window.dispatchEvent(event);
  }
  
})

window.addEventListener('RecieveWallate', function(evt) {
  if (evt.detail.msg == "recieve-wallet") {
    const publicKey = evt.detail.publicKey;
    getUserInfoForPay();
    //initModalBoxPay()
  }

})

function parseHeaders(rawHeaders) {
  var headers = new Headers();
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
  preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
    var parts = line.split(':');
    var key = parts.shift().trim();
    if (key) {
      var value = parts.join(':').trim();
      headers.append(key, value);
    }
  });
  return headers
}

function fetch_custom(data) {
  return new Promise(function(resolve, reject) {
    var request = new Request(data.input, data.init);
    if (request.signal && request.signal.aborted) {
      return reject()
    }

    var xhr = new XMLHttpRequest();

    function abortXhr() {
      xhr.abort();
    }
    
    xhr.onload = function() {
      var options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      };
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
      var body = 'response' in xhr ? xhr.response : xhr.responseText;

      var _response = btoa(JSON.stringify({body:body,options:options}));
      var event = new CustomEvent('RecieveTransaction', {detail:  _response, res:_response});
      window.dispatchEvent(event);
      // sendResponse({body:body,options:options});
      /*var event = new CustomEvent('RecieveTransaction', {detail:  "ts-complete",data:new Response(body, options)});
      window.dispatchEvent(event);*/
          
    };

    xhr.onerror = function() {
      reject(new TypeError('Network request failed'));
    };

    xhr.ontimeout = function() {
      reject(new TypeError('Network request failed'));
    };

    xhr.onabort = function() {
      reject(new exports.DOMException('Aborted', 'AbortError'));
    };

    xhr.open(request.method, request.url, true);

    if (request.credentials === 'include') {
      xhr.withCredentials = true;
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false;
    }

    /*if ('responseType' in xhr && support.blob) {
      xhr.responseType = 'blob';
    }*/

    request.headers.forEach(function(value, name) {
      xhr.setRequestHeader(name, value);
    });

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr);

      xhr.onreadystatechange = function() {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr);
        }
      };
    }

    xhr.send(data.init.body);
  })
}

function sendTransactionFunc() {
  window.addEventListener('sendTransactionEvent', function(evt) {
    fetch_custom({input:evt.detail.input, init:evt.detail.init})
  })
}
sendTransactionFunc();
var myTwitterPage ={};
function onExtMessage(message, sender, sendResponse){
  myTwitterPage.message = message;
  switch (message.command) {
    case "initTwitterBtns":
    $('[tweet-consider="1"]').removeAttr('tweet-consider');
    var injectNode = $('a[href$="/header_photo"]');
    $(injectNode).children().show();
    $('.modal-container ul').remove();
    break;

  }
}
chrome.runtime.onMessage.addListener(onExtMessage);

var callback=[];


function sendMessage(msg, callbackfn) {
  if(!!callbackfn && !!callback) {
    callback.push(callbackfn);
    msg.callback = "yes";
  }
  chrome.runtime.sendMessage(msg,callbackfn);
}


function getAllTokenPrices() {
  sendMessage({"command": "getAllTokenPrices"},function(result){
    if(chrome.runtime.lastError) {
      setTimeout(getAllTokenPrices, 50)
    } else {
      for (var i = 0; i < result.length; i++) {
        if (result[i]['type']=="solana") {
          settings.solana=result[i]['result']['solana']['usd'];
        }
        if (result[i]['type']=="usdc") {
          settings.usdc=result[i]['result']['usd-coin']['usd']
        }
      }
    
      $('[name="input_amount"]').data('settings',JSON.stringify(settings));
      var priceData='$ '+numberWithCommas(settings.solana);
      $('.xs-price').html(priceData);
    }
  })
}
getAllTokenPrices();

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}  

function addJS(jsCode) {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.innerText = jsCode;
  document.getElementsByTagName('head')[0].appendChild(s);
}

