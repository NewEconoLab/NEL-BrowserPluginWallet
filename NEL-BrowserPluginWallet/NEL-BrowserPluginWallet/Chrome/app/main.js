// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var port = null;
var getKeys = function (obj) {
    var keys = [];
    for (var key in obj) {
        keys.push(key);
    }
    return keys;
}
function appendMessage(text) {
    document.getElementById('response').innerHTML += "<p>" + text + "</p>";
}
function updateUiState() {
    if (port) {
        document.getElementById('connect-button').style.display = 'none';
        document.getElementById('input-text').style.display = 'block';
        document.getElementById('send-message-button').style.display = 'block';
    } else {
        document.getElementById('connect-button').style.display = 'block';
        document.getElementById('input-text').style.display = 'none';
        document.getElementById('send-message-button').style.display = 'none';
    }
}
function sendNativeMessage() {
    //chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //    chrome.tabs.sendMessage(tabs[0].id, { message: "setTitel2" }, function (response) {
    //        //var result = document.createElement("div")
    //        //result.textContent = response.result       
    //        //document.body.appendChild(result)
    //        appendMessage("cnblog response message: <b>" + response.result + "</b>");
    //    });
    //});  
    var oFReader = new FileReader();
    var file = document.getElementById('txtFile').files[0];
    //alert(getObjectURL(file));
    oFReader.readAsDataURL(file);
    oFReader.onloadend = function (oFRevent) {
        src = oFRevent.target.result;

        message = { "text": document.getElementById('input-text').value, "wallet": src, "PSW": $('#txtPSW').val() };
        port.postMessage(message);
        appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
        //alert(JSON.stringify(message))
    }
}
function onNativeMessage(message) {
    appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");

    //chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //    chrome.tabs.sendMessage(tabs[0].id, { message: "setNNShash", data: JSON.stringify(message.data) }, function (response) {
    //        //var result = document.createElement("div")
    //        //result.textContent = response.result       
    //        //document.body.appendChild(result)
    //        appendMessage("cnblog response message: <b>" + response.result + "</b>");
    //    });
    //});
}
function onDisconnected() {
    appendMessage("Failed to connect: " + chrome.runtime.lastError.message);
    port = null;
    updateUiState();
}
function connect() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "setTitel" }, function (response) {
            //var result = document.createElement("div")
            //result.textContent = response.result       
            //document.body.appendChild(result)
            appendMessage("cnblog response message: <b>" + response.result + "</b>");
        });
    });  

    var hostName = "com.my_company.my_application";
    appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
    port = chrome.runtime.connectNative(hostName);
    port.onMessage.addListener(onNativeMessage);
    port.onDisconnect.addListener(onDisconnected);
    updateUiState();
}

function getdata()
{
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "getdata" }, function (response) {
            appendMessage("cnblog response message: <b>" + response.result + "</b>");
        });
    });  
}

//function getObjectURL(file) {
//    var url = null;
//    if (window.createObjcectURL != undefined) {
//        url = window.createOjcectURL(file);
//    } else if (window.URL != undefined) {
//        url = window.URL.createObjectURL(file);
//    } else if (window.webkitURL != undefined) {
//        url = window.webkitURL.createObjectURL(file);
//    }
//    return url;
//} 

function sendTx() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "sendTX" }, function (response) {
            var data = response
            if (data.error) {
                $("#message").text(data.error);
                $("#content").hide();
            } else {
                $("#message").hide();
                $("#content-addrIn").text(data.addrIn);
                $("#content-addrOut").text(data.addrOut);
                $("#content-assetID").text(data.assetID);
                $("#content-amounts").text(data.amounts);
            }
        });
    });  
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('connect-button').addEventListener(
        'click', connect);
    document.getElementById('send-message-button').addEventListener(
        'click', sendNativeMessage);
    document.getElementById('butGetData').addEventListener(
        'click', getdata);
    document.getElementById('butSendTx').addEventListener(
        'click', sendTx);
    updateUiState();

    //var data = chrome.extension.getBackgroundPage().articleData;
    //if (data.error) {
    //    $("#message").text(data.error);
    //    $("#content").hide();
    //} else {
    //    $("#message").hide();
    //    $("#content-addrIn").text(data.addrIn);
    //    $("#content-addrOut").text(data.addrOut);
    //    $("#content-assetID").text(data.assetID);
    //    $("#content-amounts").text(data.amounts);
    //}
});