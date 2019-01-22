$(document).ready(function () {
    $('#butGetAccount').click(function (event) {
        getAccount();
    });
    $('#butDoInvokeTest').click(function (event) {
        sendInvokeTx(
            $('#invokeScriptHash').val(),
            JSON.stringify(JSON.parse($('#invokeParam').val()))
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
            $("#transferValue").val()
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

    window.addEventListener("message", function(e)
    {
        request = e.data;
        if(request.key === "getAccountRes")
        {
            $("#addr").text(request.msg.addr)
            // $("#balance").text(request.msg.balance)
            var balance = JSON.parse(request.msg.balance)
            $.each(balance, function( index, value ) {
                var name = value.name[0].name;
                if(name === "小蚁股") name = "NEO"
                if(name === "小蚁币") name = "GAS"
                var select = $("#listAssetID").append('<option value ="' + value.asset +'">' + name + ': ' + value.balance + '</option>');
            });
        }
        if(request.key === "tx_send_done")
        {
            alert("Tansfar Success");
            var txid = request.msg.txid;
            $("#txid").text('txid:' + txid);
            $("#txid").attr('href', 'https://scan.nel.group/test/transaction/' + txid);
        }
    }, false);
});

