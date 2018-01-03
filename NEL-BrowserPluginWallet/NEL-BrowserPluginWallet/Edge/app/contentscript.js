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

function getAsset(addr) {
    $.jsonRPC.setup({
        endPoint: 'http://47.96.168.8:81/api/testnet',
        namespace: ''
    });
    $.jsonRPC.request('getbalance', {
        params: [addr],
        success: function (data) {
            var result = data.result
            if (result != null) {
                $("#listAssetID").empty();
                $.each(result, function (index, value) {
                    var name = value.name[0].name;
                    if (name == "小蚁股") { name = "NEO" }
                    else if (name == "小蚁币") { name = "GAS" }
                    $("#listAssetID").append("<option value='" + value.asset + "'>" + value.balance + "&nbsp;" + name + "</option>");
                });
            }
            //else { $('#balance').text("No Data!"); }
        },
        error: function (data) {
            //alert(data.error.message);
            $("#listAssetID").empty();
        }
    });
}

//初始化
chrome.runtime.sendMessage({ key: "getWallets" },
    function (response) {
        var wallets = response.result.split(",");
        $("#listAddrOut").empty();
        $.each(wallets, function (index, value) {
            $("#listAddrOut").append("<option value='" + value + "'>" + value + "</option>");
        });
        getAsset(wallets[0]);
    });
//chrome.runtime.sendMessage({ key: "getbalances" },
//    function (response) {
//        var balances = JSON.parse(response.result);
//        $("#listAssetID").empty();
//        $.each(balances, function (index, value) {
//            $("#listAssetID").append("<option value='" + value.asset + "'>" + value.balance + "&nbsp;" + value.name[0].name + "</option>");
//        });
//    });


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

function getAddr(nns){
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

$("#listAddrOut").change(function (event) {
    var addr = $("#listAddrOut").find("option:selected").text();
    getAsset(addr);
});

//执行转账
$('#doTansfar').click(function (event) {
    var tansfarInfo = { addrIn: $("#txtAddrIn").val(), addrOut: $("#listAddrOut option:selected").val(), assetID: $("#listAssetID option:selected").val(), amounts: $("#txtAmounts").val()};
    chrome.runtime.sendMessage({ key: "doTansfar", value: tansfarInfo },
        function (response) {
            //alert(response.result);
        });
});

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
        if (request.message == "doTansfar") {
            alert("Tansfar Success");
            var txid = request.data;
            $("#txid").text('txid:' + txid);
            $("#txid").attr('href', 'http://47.96.168.8:81/api/testnet?jsonrpc=2.0&method=gettransaction&params=%5b%22' + txid + '%22%5d&id=1');
        }

        //if (request.message == "setTitel") {
        //    $("#cb_post_title_url").text("aaa");
        //    sendResponse({ result: "告诉你" })
        //}
        else if (request.message == "setNNShash") {
            getAddr(request.data);
            //$('#txtAddrIn').val(res);
            //$("#txtNNS").val(request.data);
            //sendResponse({ result: "NNShash Set" })
        }
        //else if (request.message == "setAddrOut") {
        //    $('#txtAddrOut').val(request.data);
        //    //$('#txtAddrIn').val(res);
        //    //$("#txtNNS").val(request.data);
        //    sendResponse({ result: "AddrOut Set" })
        //}
        //else if (request.message == "getTx") {
        //        var msg = {
        //            result: $("#txScript").val()
        //        };
        //        sendResponse(msg)
        //}
        //else if (request.message == "getData") {
        //    var postInfo = $("#datatable");
        //    if (postInfo.length != 1) {
        //        sendResponse({result: "获取文章信息失败." });
        //    }
        //    else {
        //        var msg = {
        //            addrIn: $("#txtAddrIn").val(),
        //            addrOut: $("#listAddrOut option:selected").val(),
        //            assetID: $("#listAssetID option:selected").val(),
        //            amounts: $("#txtAmounts").val(),
        //            url: document.URL
        //        };
        //        sendResponse(msg)
        //    }
        //}
        //else if (request.message == "sendTX") {
        //    $("#txPubkey").text(request.pubkey);
        //    $("#txSign").text(request.sign);
        //    $("#txDonePubkey").show();
        //    $("#txDoneSign").show();
        //}
        //else {
        //    $("#cb_post_title_url").text("bcd");
        //    sendResponse({ result: "不告诉你" })
        //}
            
    });  
