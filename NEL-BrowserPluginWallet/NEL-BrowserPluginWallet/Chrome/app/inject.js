getAccount = () =>{
    alert("inject getAccount");

    window.postMessage({
        key:"getAccount",
        msg:{}
    })
}

sendTransferTx = (from,to,asset,value) =>{
    alert("inject sendTransferTx");

    window.postMessage({
        key:"sendTransferTx",
        msg:{
            from: from, 
            to: to,
            asset: asset,
            value: value
        }
    })
}

sendInvokeTx = (scriptHash,invokeParam) =>{
    alert("inject sendInvokeTx");
    window.postMessage({
        key:"sendInvokeTx",
        msg:{
            scriptHash: scriptHash, 
            invokeParam: invokeParam
        }
    })
}

function sendMsgTest() {
    window.postMessage({"test": '这里是inject.js'}, '*');
}

// window.addEventListener("message", function(e)
// {
//     //alert(e.data)
//     console.log(JSON.stringify(e.data));
// }, false);