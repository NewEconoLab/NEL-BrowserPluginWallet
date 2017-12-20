$(document).ready(function () {
    $('#butMakeTX').click(function (event) {
        $.post("https://api.otcgo.cn/testnet/transfer",
            {
                dests: $("#txtAddrIn").val(),
                source: $("#txtAddrOut").val(),
                assetId: $("#listAssetID option:selected").val(),
                amounts: $("#txtAmounts").val()
            },
            function (data, status) {
                //alert("数据：" + data + "\n状态：" + status);
                var dataJ = jQuery.parseJSON(data);
                if (dataJ.result == true) {
                    $("#txScript").text(dataJ.transaction);
                }
                else {
                    $("#txScript").text('生成tx失败！');
                }
                
                $("#txDone").show();
            });
    });
    $('#butDoBroadcast').click(function (event) {
        $.post("https://api.otcgo.cn/testnet/broadcast",
            {
                publicKey: $("#txPubkey").text(),
                signature: $("#txSign").val(),
                transaction: $("#txScript").val(),
            },
            function (data, status) {
                //alert("数据：" + data + "\n状态：" + status);
                var dataJ = jQuery.parseJSON(data);
                if (dataJ.result == true) {
                    $("#txid").text('txid:' + dataJ.txid);
                    $("#txid").attr('href', 'https://neoscan-testnet.io/transaction/' + dataJ.txid)
                }
                else {
                    $("#txid").val('txid:' + dataJ.error);
                }

                $("#txDone").show();
            });
    });
});