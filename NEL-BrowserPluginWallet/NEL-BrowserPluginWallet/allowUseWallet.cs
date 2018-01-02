using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Newtonsoft.Json.Linq;

namespace BrowserPluginWallet
{
    public partial class allowUseWallet : Form
    {
        public string PSW = string.Empty;

        public allowUseWallet(string addrIn, string addrOut,string assetID, string amounts)
        {
            InitializeComponent();
            listView1.Items.Add("即将执行转账交易如下");
            listView1.Items.Add("");
            listView1.Items.Add("转入地址：" + addrIn);
            listView1.Items.Add("转出地址：" + addrOut);
            string res = httpHelper.Get("http://47.96.168.8:81/api/testnet?jsonrpc=2.0&method=getasset&params=%5b%22" + assetID + "%22%5d&id=1",new Dictionary<string, string>());
            JObject J = JObject.Parse(res);
            string assetName = (string)J["result"][0]["name"][0]["name"];
            if (assetName == "小蚁股") { assetName = "NEO"; }
            else if (assetName == "小蚁币") { assetName = "GAS"; }
            listView1.Items.Add("资产：" + assetName);
            listView1.Items.Add("金额：" + amounts);

            this.TopMost = true;
        }

        private void butAllow_Click(object sender, EventArgs e)
        {
            PSW = txPSW.Text;
        }
    }
}
