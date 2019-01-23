$(document).ready(function () {
    $('#butGetAccount').click(function (event) {
        getAccount(function(res){
            alert("getAccount res callback");
            $("#addr").text(res.addr)
            // $("#balance").text(request.msg.balance)
            var balance = JSON.parse(res.balance)
            $.each(balance, function( index, value ) {
                var name = value.name[0].name;
                if(name === "小蚁股") name = "NEO"
                if(name === "小蚁币") name = "GAS"
                var select = $("#listAssetID").append('<option value ="' + value.asset +'">' + name + ': ' + value.balance + '</option>');
            });
        });
    });
    $('#butDoInvokeTest').click(function (event) {
        sendInvokeTx(
            $('#invokeScriptHash').val(),
            JSON.stringify(JSON.parse($('#invokeParam').val())),
            (res) =>{
                alert("tx_send_done callback" + res.txid);
                alert("Tansfar Success");
                var txid = res.txid;
                $("#txid").text('txid:' + txid);
                $("#txid").attr('href', 'https://scan.nel.group/test/transaction/' + txid);
            }
        );
        // $.post("https://api.otcgo.cn/testnet/transfer",
        //     {
        //         dests: $("#txtAddrIn").val(),
        //         source: $("#txtAddrOut").val(),
        //         assetId: $("#listAssetID option:selected").val(),
        //         amounts: $("#txtAmounts").val()
        //     },
        //     function (data, status) {
        //         //alert("数据：" + data + "\n状态：" + status);
        //         var dataJ = jQuery.parseJSON(data);
        //         if (dataJ.result == true) {
        //             $("#txScript").text(dataJ.transaction);
        //         }
        //         else {
        //             $("#txScript").text('生成tx失败！');
        //         }
                
        //         $("#txDone").show();
        //     });
    });
    $('#butDoTarnsferTest').click(function (event) {
        sendTransferTx(
            $("#addr").text(),
            $("#addr").text(),
            $("#listAssetID option:selected").val(),
            $("#transferValue").val(),
            (res) =>{
                alert("tx_send_done callback" + res.txid);
                alert("Tansfar Success");
                var txid = res.txid;
                $("#txid").text('txid:' + txid);
                $("#txid").attr('href', 'https://scan.nel.group/test/transaction/' + txid);
            }
        );
        // $.post("https://api.otcgo.cn/testnet/broadcast",
        //     {
        //         publicKey: $("#txPubkey").text(),
        //         signature: $("#txSign").val(),
        //         transaction: $("#txScript").val(),
        //     },
        //     function (data, status) {
        //         //alert("数据：" + data + "\n状态：" + status);
        //         var dataJ = jQuery.parseJSON(data);
        //         if (dataJ.result == true) {
        //             $("#txid").text('txid:' + dataJ.txid);
        //             $("#txid").attr('href', 'https://neoscan-testnet.io/transaction/' + dataJ.txid)
        //         }
        //         else {
        //             $("#txid").val('txid:' + dataJ.error);
        //         }

        //         $("#txDone").show();
        //     });
    });

    // window.addEventListener("message", function(e)
    // {
    //     request = e.data;
    //     if(request.key === "getAccount_R")
    //     {
    //         alert("getAccountRes listener");
    //     }
    //     if(request.key === "sendTransferTx_R")
    //     {
    //         alert("sendTransferTx_R listener");
    //     }
    //     if(request.key === "sendInvokeTx_R")
    //     {
    //         alert("sendInvokeTx_R listener");
    //     }

    // }, false);
});

