getAccount = (callback) =>{
    alert("inject getAccount");

    window.postMessage({
        key:"getAccount",
        msg:{}
    })

    window.addEventListener("message", function(e)
    {
        request = e.data;
        if(request.key === "getAccount_R")
        {
            callback(request.msg);
        }
    }, false);
}

sendTransferTx = (from,to,asset,value,callback) =>{
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

    window.addEventListener("message", function(e)
    {
        request = e.data;
        if(request.key === "sendTransferTx_R")
        {
            callback(request.msg);
        }
    }, false);
}

sendInvokeTx = (scriptHash,invokeParam,callback) =>{
    alert("inject sendInvokeTx");
    window.postMessage({
        key:"sendInvokeTx",
        msg:{
            scriptHash: scriptHash, 
            invokeParam: invokeParam
        }
    })

    window.addEventListener("message", function(e)
    {
        request = e.data;
        if(request.key === "sendInvokeTx_R")
        {
            callback(request.msg);
        }
    }, false);
}

function sendMsgTest() {
    window.postMessage({"test": '这里是inject.js'}, '*');
}

// window.addEventListener("message", function(e)
// {
//     //alert(e.data)
//     console.log(JSON.stringify(e.data));
// }, false);