
const WWW = class
{
    constructor()
    {
        this.api="https://api.nel.group/api/testnet"
        this.apiaggr = "https://apiwallet.nel.group/api/testnet";
    }
    makeRpcUrl(url, method, ..._params)
    {
        if (url[ url.length - 1 ] != '/')
            url = url + "/";
        var urlout = url + "?jsonrpc=2.0&id=1&method=" + method + "&params=[";
        for (var i = 0; i < _params.length; i++)
        {
            urlout += JSON.stringify(_params[ i ]);
            if (i != _params.length - 1)
                urlout += ",";
        }
        urlout += "]";
        return urlout;
    }
    makeRpcPostBody(method, ..._params)
    {
        var body = {};
        body[ "jsonrpc" ] = "2.0";
        body[ "id" ] = 1;
        body[ "method" ] = method;
        var params = [];
        for (var i = 0; i < _params.length; i++)
        {
            params.push(_params[ i ]);
        }
        body[ "params" ] = params;
        return body;
    }
    
    async rpc_getInvokescript(scripthash)
    {
        var str = this.makeRpcUrl(this.api, "invokescript", scripthash.toHexString());
        var result = await fetch(str, { "method": "get" });
        var json = await result.json();
        if (json[ "result" ] == null)
            return null;
        var r = json[ "result" ][ 0 ]
        return r;
    }

    async rpc_getBalance(addr)
    {
        var str = this.makeRpcUrl(this.api, "getbalance", addr);
        var result = await fetch(str, { "method": "get" });
        var json = await result.json();
        if (json[ "result" ] == null)
            return null;
        var r = json[ "result" ]
        return r;
    }

}