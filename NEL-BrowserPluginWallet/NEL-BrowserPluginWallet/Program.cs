using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;
using Neo;
using Neo.Core;
using Neo.Implementations.Wallets.NEP6;
using Neo.SmartContract;
using Neo.VM;
using Neo.Wallets;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

//[assembly: log4net.Config.XmlConfigurator(Watch = true)]
namespace BrowserPluginWallet
{
    class Program
    {
        //httpHelper hh = new httpHelper();
        private static NEP6Wallet wallet;

        public static void Main(string[] args)
        {
            JObject data;
            while ((data = Read()) != null)
            {
                var processed = ProcessMessage(data);
                //System.IO.File.WriteAllLines(@"log.txt", new string[] { "echo:",processed });
                Write(processed);
                if ((string)processed["key"] == "exit")
                {
                    return;
                }
            }
        }

        public static bool IsMatch(string expression, string str)
        {
            Regex reg = new Regex(expression);
            if (string.IsNullOrEmpty(str))
                return false;
            return reg.IsMatch(str);
        }
        private static string[] splitNNS(string nns)
        {
            string[] nnsS = nns.Split('.');
            string domain = nnsS[nnsS.Length - 1];
            string name = nnsS[nnsS.Length - 2];
            string subname = string.Join(".", nnsS);
            if (subname.Length <= (domain.Length + name.Length + 1))
            {
                subname = "";
            }
            else
            {
                subname = subname.Substring(0, subname.Length - domain.Length - name.Length - 2);
            }

            return new string[] { domain, name, subname };
        }
        private static byte[] NameHash(string nns)
        {
            Neo.Cryptography.Crypto c = new Neo.Cryptography.Crypto();

            byte[] namehash = c.Hash256(Encoding.UTF8.GetBytes(string.Join("", splitNNS(nns))));

            return namehash;
        }

        public static byte[] HexString2Bytes(string str)
        {
            byte[] outd = new byte[str.Length / 2];
            for (var i = 0; i < str.Length / 2; i++)
            {
                outd[i] = byte.Parse(str.Substring(i * 2, 2), System.Globalization.NumberStyles.HexNumber);
            }
            return outd;
        }
        private static byte[] Sign(byte[] message, byte[] prikey)
        {
            var Secp256r1_G = HexString2Bytes("04" + "6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296" + "4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5");

            var PublicKey = Neo.Cryptography.ECC.ECCurve.Secp256r1.G * prikey;
            var pubkey = PublicKey.EncodePoint(false).Skip(1).ToArray();
            //#if NET461
            const int ECDSA_PRIVATE_P256_MAGIC = 0x32534345;
            prikey = BitConverter.GetBytes(ECDSA_PRIVATE_P256_MAGIC).Concat(BitConverter.GetBytes(32)).Concat(pubkey).Concat(prikey).ToArray();
            using (System.Security.Cryptography.CngKey key = System.Security.Cryptography.CngKey.Import(prikey, System.Security.Cryptography.CngKeyBlobFormat.EccPrivateBlob))
            using (System.Security.Cryptography.ECDsaCng ecdsa = new System.Security.Cryptography.ECDsaCng(key))
            //#else
            //            using (var ecdsa = System.Security.Cryptography.ECDsa.Create(new System.Security.Cryptography.ECParameters
            //            {
            //                Curve = System.Security.Cryptography.ECCurve.NamedCurves.nistP256,
            //                D = prikey,
            //                Q = new System.Security.Cryptography.ECPoint
            //                {
            //                    X = pubkey.Take(32).ToArray(),
            //                    Y = pubkey.Skip(32).ToArray()
            //                }
            //            }))
            //#endif
            {
                return ecdsa.SignData(message, System.Security.Cryptography.HashAlgorithmName.SHA256);
            }
        }

        private static void openWallet(JObject data) {
            var walletJson = data["wallet"].Value<string>();
            walletJson = walletJson.Split(',')[1];
            walletJson = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(walletJson));
            string fp = Environment.CurrentDirectory + @"\wallet.json";
            File.WriteAllText(fp, walletJson);

            string PWS = string.Empty;
            using (allowUseWallet dialog = new allowUseWallet((string)data["addrIn"], (string)data["addrOut"], (string)data["assetID"], (string)data["amounts"]))
            {
                if (dialog.ShowDialog() != DialogResult.OK) return;
                PWS = dialog.PSW;

                wallet = new NEP6Wallet(fp);
                try
                {
                    wallet.Unlock(PWS);
                }
                catch (CryptographicException e)
                {
                    //MessageBox.Show(Strings.PasswordIncorrect);
                    //return e.Message;
                }
            }
        }

        public static JObject ProcessMessage(JObject data)
        {
            JObject resJ = new JObject();

            var message = data["text"].Value<string>();

            switch (message)
            {
                case "namehash":
                    try
                    {
                        var nns = data["data"].Value<string>();
                        System.IO.File.WriteAllLines(@"log.txt", new string[] { "echo:", nns });
                        var Key = NameHash(nns);
                        var KeyStr = Key.ToHexString();
                        resJ["key"] = message;
                        resJ["data"] = KeyStr;
                    }
                    catch (Exception e)
                    {
                        System.IO.File.WriteAllLines(@"err.txt", new string[] { "error:", e.Message });
                        var KeyStr = "请输入符合规则的域名";
                        resJ["key"] = message;
                        resJ["data"] = KeyStr;
                    }
                    break;
                case "doTansfar":
                    JObject tansfarInfoJ = (JObject)data["tansfarInfo"];
                    //var walletJson = tansfarInfoJ["wallet"].Value<string>();
                    //walletJson = walletJson.Split(',')[1];
                    //walletJson = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(walletJson));
                    //JObject Jwallet = JObject.Parse(walletJson);
                    var key = (string)tansfarInfoJ["key"];
                    //var scrypt = Jwallet["scrypt"];
                    string PSW = string.Empty;
                    using (allowUseWallet dialog = new allowUseWallet((string)tansfarInfoJ["addrIn"], (string)tansfarInfoJ["addrOut"], (string)tansfarInfoJ["assetID"], (string)tansfarInfoJ["amounts"]))
                    {
                        if (dialog.ShowDialog() == DialogResult.OK)
                        {
                            PSW = dialog.PSW;
                        }           
                    }
                    //nep2key 6PYPh1msaJEUvhCkVMxq2Lfu31f3PjAcfQSXQre6vbQguY7ZQeZou5TiB9
                    //nep2Key to privateKey
                    byte[] privateKey = neoHelper.GetPrivateKeyFromNEP2(key, PSW);
                    string privateKeyHexStr = BitConverter.ToString(privateKey).Replace("-", "").ToLower();
                    //privateKeyHexStr 25228cd2b2aeb4fec8065cadab8dc28cb618fba3a789853fcda357c37f0864c1

                    //privateKey to publicKey
                    byte[] publicKey = neoHelper.getPublickeyFromPrivateKey(privateKey);
                    string publicKeyHexStr = BitConverter.ToString(publicKey).Replace("-", "").ToLower();
                    //publicKeyHexStr 029020fd0914c677a1ab7d8b3502ca9a4506efbf7572ea24fb3862f48dd153ee5b

                    //调用蓝鲸淘构造转账交易api
                    Dictionary<string, string> tansfarInfoDic = new Dictionary<string, string>() {
                        { "source",(string)tansfarInfoJ["addrOut"]},
                        { "dests",(string)tansfarInfoJ["addrIn"] },
                        { "amounts",(string)tansfarInfoJ["amounts"] },
                        { "assetId",((string)tansfarInfoJ["assetID"]).Replace("0x","")}
                    };
                    var tansfarInfoDicStr = JsonConvert.SerializeObject(tansfarInfoDic);
                    //{"source":"AYX8yqcvQroV9mJ5k4Ez2gro8Kjh7B78kD","dests":"AUb5MeSrTcmqBchWwsDVu8qgZ2Xv9E9ars","amounts":"0.01","assetId":"c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b"}
                    string resp = httpHelper.Post("https://api.otcgo.cn/testnet/transfer", tansfarInfoDic);
                    JObject j = JObject.Parse(resp);
                    string transactionScript = (string)j["transaction"];
                    //80000001601715e825765452b25ab16979ce65a6705583dfebaa056c2a011aeda868dd4b0000029b7cffdaa674beae0f930ebe6085af9093e5fe56b34a5c220ccdcf6efc336fc540420f00000000008c8ed58be92fd1b01896dd9e02acd45776eb3e8c9b7cffdaa674beae0f930ebe6085af9093e5fe56b34a5c220ccdcf6efc336fc5c0878b3b00000000b7b0b2d92b970affd9567faf10205ca222e38933

                    string txStr = string.Empty;
                    //using (ScriptBuilder sb = new ScriptBuilder())
                    //{
                    //    sb.EmitAppCall(UInt160.Parse(tansfarInfoDic["assetId"]), "transfer",Wallet.ToScriptHash(tansfarInfoDic["dests"]), Wallet.ToScriptHash(tansfarInfoDic["source"]), tansfarInfoDic["amounts"]);
                    //    sb.Emit(OpCode.THROWIFNOT);

                    //    txStr = sb.ToArray().ToHexString();
                    //}

                    //string remark = "";
                    //Transaction tx = new ContractTransaction();
                    //List<TransactionAttribute> attributes = new List<TransactionAttribute>();
                    //    attributes.Add(new TransactionAttribute
                    //    {
                    //        Usage = TransactionAttributeUsage.Remark,
                    //        Data = Encoding.UTF8.GetBytes(remark)
                    //    });
                    //tx.Attributes = attributes.ToArray();
                    //tx.Outputs = new TransactionOutput[]{ new TransactionOutput {
                    //    AssetId = UInt256.Parse(tansfarInfoDic["assetId"]),
                    //    Value = Fixed8.Parse(tansfarInfoDic["amounts"]),
                    //    ScriptHash = Wallet.ToScriptHash(tansfarInfoDic["source"])
                    //} };
                    //tx.Inputs = new CoinReference[] { new CoinReference {
                    //    PrevHash = UInt256.Parse("0x2926ca1fa51a54c50951be340a217d83035489da4cb9ea2dd46550e12d2234c3"),
                    //    PrevIndex = 0
                    //} };
                    //var txScript = tx.GetHashData().ToHexString();

                    txStr = getTransferTxHex(tansfarInfoDic["source"], tansfarInfoDic["dests"], "0x" + tansfarInfoDic["assetId"], decimal.Parse(tansfarInfoDic["amounts"]));
                    string sign = Sign(txStr.HexToBytes(), privateKey).ToHexString();
                    var txStr2 = getTxSignHex(txStr,sign,publicKeyHexStr);

                    string signature = Sign(transactionScript.HexToBytes(), privateKey).ToHexString();

                    ////调用蓝鲸淘发送交易api
                    //Dictionary<string, string> signInfoDic = new Dictionary<string, string>() {
                    //        { "publicKey",publicKeyHexStr},
                    //        { "signature",signature },
                    //        { "transaction",transactionScript },
                    //    };
                    //string resp2 = httpHelper.Post("https://api.otcgo.cn/testnet/broadcast", signInfoDic);
                    //JObject j2 = JObject.Parse(resp2);
                    //string txid = (string)j2["txid"];

                    //resJ["key"] = message;
                    //resJ["data"] = txid;

                    
                    //try
                    //{
                    //    string publickey = string.Empty;
                    //    string signature = string.Empty;
                    //    foreach (WalletAccount walletaccount in wallet.GetAccounts())
                    //    {
                    //        //根据输出地址选择key
                    //        if (walletaccount.Address == tansfarInfoDic["source"])
                    //        {
                    //            KeyPair addrKey = walletaccount.GetKey();

                    //            publickey = addrKey.PublicKey.EncodePoint(true).ToHexString();

                    //            addrKey.Decrypt();
                    //            var pk = addrKey.PrivateKey;

                    //            signature = Sign(transactionScript.HexToBytes(), pk).ToHexString();

                    //            break;
                    //        }
                    //    }

                    //    Dictionary<string, string> signInfoDic = new Dictionary<string, string>() {
                    //        { "publicKey",publickey},
                    //        { "signature",signature },
                    //        { "transaction",transactionScript },
                    //    };
                    //    string resp2 = httpHelper.Post("https://api.otcgo.cn/testnet/broadcast", signInfoDic);
                    //    JObject j2 = JObject.Parse(resp2);
                    //    string txid = (string)j2["txid"];

                    //    resJ["key"] = message;
                    //    resJ["data"] = txid;
                    //}
                    //catch { }
                    break;
                //case "openWallet":
                //    openWallet(data);
                //    try
                //    {
                //        string addr = wallet.GetAccounts().ToArray()[0].Address;
                //        resJ["key"] = message;
                //        resJ["data"] = addr;
                //    }
                //    catch { }
                //    break;
                    //case "test":
                    //    resJ["key"]= message;
                    //    resJ["data"] = "testing!";
                    //    break;
                    //case "exit":
                    //    resJ["key"] = message;
                    //    resJ["data"] = "exit!";
                    //    break;


                    //default:
                    //    try
                    //    {
                    //        message = httpHelper.Get("https://api.otcgo.cn/testnet/address/" + message, new Dictionary<string, string>());
                    //        JObject j = JObject.Parse(message);
                    //        message = JsonConvert.SerializeObject(j["balances"]);
                    //    }
                    //    catch
                    //    { }
            }

            return resJ;
        }

        
        private static string getTransferTxHex(string addrOut,string addrIn,string assetID,decimal amounts)
        {
            ThinNeo.Transaction lastTran;

            string inputJson = "{ 'jsonrpc':'2.0','method':'getutxo','params':['" + addrOut +"'],'id':1}";
            string outputJson = httpHelper.Post("http://47.96.168.8:81/api/testnet", inputJson);
            JObject outputJ = JObject.Parse(outputJson);
            //linq查找指定asset最大的utxo
            var query = from utxos in outputJ["result"].Children()
                        where (string)utxos["asset"] == assetID
                        orderby (decimal)utxos["value"] descending
                        select utxos;
            var utxo = query.ToList()[0];
            byte[] utxo_txid = ((string)utxo["txid"]).Replace("0x", "").HexToBytes().Reverse().ToArray();
            ushort utxo_n = (ushort)utxo["n"];
            decimal utxo_value = (decimal)utxo["value"];
            byte[] assetBytes = assetID.Replace("0x", "").HexToBytes().Reverse().ToArray();

            var a = utxo_txid.ToHexString();
            var b = assetBytes.ToHexString();

            if (amounts > utxo_value) {
                return string.Empty;
            }

            lastTran = new ThinNeo.Transaction();
            lastTran.type = ThinNeo.TransactionType.ContractTransaction;//转账
            lastTran.attributes = new ThinNeo.Attribute[0];
            lastTran.inputs = new ThinNeo.TransactionInput[1];
            lastTran.inputs[0] = new ThinNeo.TransactionInput();
            lastTran.inputs[0].hash = utxo_txid;//吃掉一个utxo
            lastTran.inputs[0].index = utxo_n;

            lastTran.outputs = new ThinNeo.TransactionOutput[2];
            lastTran.outputs[0] = new ThinNeo.TransactionOutput();//给对方转账
            lastTran.outputs[0].assetId = assetBytes;
            lastTran.outputs[0].toAddress = ThinNeo.Helper.GetPublicKeyHashFromAddress(addrIn);
            lastTran.outputs[0].value = amounts;
            lastTran.outputs[1] = new ThinNeo.TransactionOutput();//给自己找零
            lastTran.outputs[1].assetId = assetBytes;
            lastTran.outputs[1].toAddress = ThinNeo.Helper.GetPublicKeyHashFromAddress(addrOut);
            lastTran.outputs[1].value = utxo_value - amounts;

            var c = ThinNeo.Helper.GetPublicKeyHashFromAddress(addrIn).ToHexString();
            var d = amounts;
            var e = ThinNeo.Helper.GetPublicKeyHashFromAddress(addrOut).ToHexString();
            var f = utxo_value - amounts;

            using (var ms = new System.IO.MemoryStream())
            {
                lastTran.SerializeUnsigned(ms);
                return ThinNeo.Helper.Bytes2HexString(ms.ToArray());
            }
        }

        private static string getTxSignHex(string txScriptHex,string signHex,string publicKeyHex)
        {
            byte[] txScript = txScriptHex.HexToBytes();
            var sign = signHex.HexToBytes();
            //byte[] prikey = privateKeyHex.HexToBytes();

            //var prikeyStr = ThinNeo.Helper.Bytes2HexString(prikey);

            //byte[] sign = null;

            //sign = ThinNeo.Helper.Sign(txScript, prikey);

            //var signStr = ThinNeo.Helper.Bytes2HexString(sign);

            //var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
            var pubkey = publicKeyHex.HexToBytes();
            var addr = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);

            ThinNeo.Transaction lastTran = new ThinNeo.Transaction();
            lastTran.Deserialize(new MemoryStream(txScriptHex.HexToBytes()));
            lastTran.witnesses = null;
            lastTran.AddWitness(sign, pubkey, addr);
            using (var ms = new System.IO.MemoryStream())
            {
                lastTran.Serialize(ms);
                return ThinNeo.Helper.Bytes2HexString(ms.ToArray());
            }
        }

        public static JObject Read()
        {
            byte[] inputBuffer = new byte[65535];
            Stream inputStream = Console.OpenStandardInput(inputBuffer.Length);
            Console.SetIn(new StreamReader(inputStream, Console.InputEncoding, false, inputBuffer.Length));
            var str = Console.ReadLine(); //"{'text':'" + Console.ReadLine() + "'}";
            return (JObject)JsonConvert.DeserializeObject<JObject>(str);

            //byte[] inputBuffer = new byte[65535];
            //Stream inputStream = Console.OpenStandardInput(inputBuffer.Length);

            //int length = 0;

            //byte[] lengthBytes = new byte[4];
            //inputStream.Read(lengthBytes, 0, 4);
            //length = BitConverter.ToInt32(lengthBytes, 0);

            //var buffer = new char[length];
            //using (var reader = new StreamReader(inputStream, Console.InputEncoding, false, inputBuffer.Length))
            //{
            //    while (reader.Peek() >= 0)
            //    {
            //        reader.Read(buffer, 0, buffer.Length);
            //    }
            //}

            //return JsonConvert.DeserializeObject<JObject>(new string(buffer));
        }

        public static void Write(JObject data)
        {
            var json = new JObject();

            json["data"] = data;

            var bytes = System.Text.Encoding.UTF8.GetBytes(json.ToString(Formatting.None));

            var stdout = Console.OpenStandardOutput();
            stdout.WriteByte((byte)((bytes.Length >> 0) & 0xFF));
            stdout.WriteByte((byte)((bytes.Length >> 8) & 0xFF));
            stdout.WriteByte((byte)((bytes.Length >> 16) & 0xFF));
            stdout.WriteByte((byte)((bytes.Length >> 24) & 0xFF));
            stdout.Write(bytes, 0, bytes.Length);
            stdout.Flush();
        }
    }
}
