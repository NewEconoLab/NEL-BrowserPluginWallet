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

                    Dictionary<string, string> tansfarInfoDic = new Dictionary<string, string>() {
                        { "source",(string)tansfarInfoJ["addrOut"]},
                        { "dests",(string)tansfarInfoJ["addrIn"] },
                        { "amounts",(string)tansfarInfoJ["amounts"] },
                        { "assetId",((string)tansfarInfoJ["assetID"]).Replace("0x","")}
                    };
                    string resp = httpHelper.Post("https://api.otcgo.cn/testnet/transfer", tansfarInfoDic);
                    JObject j = JObject.Parse(resp);
                    string transactionScript = (string)j["transaction"];

                    openWallet(tansfarInfoJ);
                    try
                    {
                        string publickey = string.Empty;
                        string signature = string.Empty;
                        foreach (WalletAccount walletaccount in wallet.GetAccounts())
                        {
                            //根据输出地址选择key
                            if (walletaccount.Address == tansfarInfoDic["source"])
                            {
                                KeyPair addrKey = walletaccount.GetKey();

                                publickey = addrKey.PublicKey.EncodePoint(true).ToHexString();

                                addrKey.Decrypt();
                                var pk = addrKey.PrivateKey;

                                signature = Sign(transactionScript.HexToBytes(), pk).ToHexString();

                                break;
                            }
                        }

                        Dictionary<string, string> signInfoDic = new Dictionary<string, string>() {
                            { "publicKey",publickey},
                            { "signature",signature },
                            { "transaction",transactionScript },
                        };
                        string resp2 = httpHelper.Post("https://api.otcgo.cn/testnet/broadcast", signInfoDic);
                        JObject j2 = JObject.Parse(resp2);
                        string txid = (string)j2["txid"];

                        resJ["key"] = message;
                        resJ["data"] = txid;
                    }
                    catch { }
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

        public static JObject Read()
        {
            string PSW = Console.ReadLine();
            try {
                var privateKeyHexStr = BitConverter.ToString(Wallet.GetPrivateKeyFromNEP2("6PYKrmHiax24CMSFK5qhQkZEBntE5WGDznuh3hvRz5JLKeqJYWMiqMC6yi", PSW)).Replace("-", "").ToLower();
                Console.WriteLine(privateKeyHexStr);
            }
            catch {
                Console.WriteLine("PSW Error！");
            }
            //MessageBox.Show(System.Text.Encoding.UTF8.GetString(Wallet.GetPrivateKeyFromNEP2("6PYKrmHiax24CMSFK5qhQkZEBntE5WGDznuh3hvRz5JLKeqJYWMiqMC6yi", "Terry1128")));
            //byte[] inputBuffer = new byte[65535];
            //Stream inputStream = Console.OpenStandardInput(inputBuffer.Length);
            //Console.SetIn(new StreamReader(inputStream, Console.InputEncoding, false, inputBuffer.Length));
            //var str = Console.ReadLine(); //"{'text':'" + Console.ReadLine() + "'}";
            //return (JObject)JsonConvert.DeserializeObject<JObject>(str);

            byte[] inputBuffer = new byte[65535];
            Stream inputStream = Console.OpenStandardInput(inputBuffer.Length);

            int length = 0;

            byte[] lengthBytes = new byte[4];
            inputStream.Read(lengthBytes, 0, 4);
            length = BitConverter.ToInt32(lengthBytes, 0);

            var buffer = new char[length];
            using (var reader = new StreamReader(inputStream, Console.InputEncoding, false, inputBuffer.Length))
            {
                while (reader.Peek() >= 0)
                {
                    reader.Read(buffer, 0, buffer.Length);
                }
            }

            return JsonConvert.DeserializeObject<JObject>(new string(buffer));
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
