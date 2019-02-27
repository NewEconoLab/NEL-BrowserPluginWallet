// 首先需要提前定义好事件，并且注册相关的EventListener
var readyEvent = new CustomEvent('READY', { 
    detail: { title: 'Wallet is ready!'},
});
// window.addEventListener('READY', function(event){
//     console.log('消息为：', event.detail.title);
// });
// 随后在对应的元素上触发该事件
if(window.dispatchEvent) {  
    window.dispatchEvent(readyEvent);
} else {
    window.fireEvent(readyEvent);
}
// 根据listener中的callback函数定义，应当会在console中输出 "得到标题为： This is title!"

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