using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace BrowserPluginWallet
{
    public partial class allowUseWallet : Form
    {
        public string PSW = string.Empty;

        public allowUseWallet()
        {
            InitializeComponent();

            this.TopMost = true;
        }

        private void butAllow_Click(object sender, EventArgs e)
        {
            PSW = txPSW.Text;
        }
    }
}
