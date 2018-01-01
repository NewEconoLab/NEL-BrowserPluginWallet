//var postInfo = $("#datatable");
//if(postInfo.length!=1){
//	chrome.runtime.sendMessage({type:"cnblog-article-information", error:"获取文章信息失败."});
//}
//else{
//	var msg = {
//		type: "cnblog-article-information",
//        addrIn: $("#txtAddrIn").val(),
//        addrOut: $("#txtAddrOut").val(),
//        assetID: $("#listAssetID option:selected").val(),
//        amounts: $("#txtAmounts").val(),
//	};
//	chrome.runtime.sendMessage(msg);
//}
function convertFromHex(hex) {
    var hex = hex.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function convertToHex(str) {
    var hex = '';
    for (var i = 0; i < str.length; i++) {
        hex += '' + str.charCodeAt(i).toString(16);
    }
    return hex;
}

function getBalance(nns){
    $.jsonRPC.setup({
        endPoint: 'http://101.89.140.195:20332',
        namespace: ''
    });
    $.jsonRPC.request('getstorage', {
        params: ["706c89208c5b6016a054a58cc83aeda0d70f0f95", nns],
        success: function (data) {
            var result = data.result
            if (result != null) {
                $('#txtAddrIn').val(convertFromHex(data.result));
            }
            else { $('#txtAddrIn').val("无解析！");}

        },
        error: function (data) {
            //alert(data.error.message);
        }
    });
}

$('#butResolve').click(function(event){
    chrome.runtime.sendMessage({ key: "nns", value: $('#txtNNS').val() },
        function (response) {
            //alert(response.result);
        });
});

$('#butGetWallet').click(function (event) {
    chrome.runtime.sendMessage({ key: "getWallet" },
        function (response) {
            //$('#txtAddrOut').val(response.result);
        });
});

chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message == "setTitel") {
            $("#cb_post_title_url").text("aaa");
            sendResponse({ result: "告诉你" })
        }
        else if (request.message == "setNNShash") {
            getBalance(request.data);
            //$('#txtAddrIn').val(res);
            //$("#txtNNS").val(request.data);
            sendResponse({ result: "NNShash Set" })
        }
        else if (request.message == "setAddrOut") {
            $('#txtAddrOut').val(request.data);
            //$('#txtAddrIn').val(res);
            //$("#txtNNS").val(request.data);
            sendResponse({ result: "AddrOut Set" })
        }
        else if (request.message == "getTx") {
                var msg = {
                    result: $("#txScript").val()
                };
                sendResponse(msg)
        }
        else if (request.message == "getData") {
            var postInfo = $("#datatable");
            if (postInfo.length != 1) {
                sendResponse({result: "获取文章信息失败." });
            }
            else {
                var msg = {
                    addrIn: $("#txtAddrIn").val(),
                    addrOut: $("#txtAddrOut").val(),
                    assetID: $("#listAssetID option:selected").val(),
                    amounts: $("#txtAmounts").val(),
                    url: document.URL
                };
                sendResponse(msg)
            }
        }
        else if (request.message == "sendTX") {
            $("#txPubkey").text(request.pubkey);
            $("#txSign").text(request.sign);
            $("#txDonePubkey").show();
            $("#txDoneSign").show();
        }
        else {
            $("#cb_post_title_url").text("bcd");
            sendResponse({ result: "不告诉你" })
        }
            
    });  
