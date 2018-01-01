namespace BrowserPluginWallet
{
    partial class allowUseWallet
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.txPSW = new System.Windows.Forms.TextBox();
            this.butAllow = new System.Windows.Forms.Button();
            this.butCancel = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.listView1 = new System.Windows.Forms.ListView();
            this.SuspendLayout();
            // 
            // txPSW
            // 
            this.txPSW.Location = new System.Drawing.Point(47, 291);
            this.txPSW.Name = "txPSW";
            this.txPSW.PasswordChar = '*';
            this.txPSW.Size = new System.Drawing.Size(575, 35);
            this.txPSW.TabIndex = 0;
            // 
            // butAllow
            // 
            this.butAllow.DialogResult = System.Windows.Forms.DialogResult.OK;
            this.butAllow.Location = new System.Drawing.Point(280, 353);
            this.butAllow.Name = "butAllow";
            this.butAllow.Size = new System.Drawing.Size(190, 79);
            this.butAllow.TabIndex = 1;
            this.butAllow.Text = "同意";
            this.butAllow.UseVisualStyleBackColor = true;
            this.butAllow.Click += new System.EventHandler(this.butAllow_Click);
            // 
            // butCancel
            // 
            this.butCancel.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.butCancel.Location = new System.Drawing.Point(47, 353);
            this.butCancel.Name = "butCancel";
            this.butCancel.Size = new System.Drawing.Size(194, 79);
            this.butCancel.TabIndex = 2;
            this.butCancel.Text = "取消";
            this.butCancel.UseVisualStyleBackColor = true;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(43, 253);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(178, 24);
            this.label1.TabIndex = 3;
            this.label1.Text = "输入钱包密码：";
            // 
            // listView1
            // 
            this.listView1.Location = new System.Drawing.Point(47, 12);
            this.listView1.Name = "listView1";
            this.listView1.Size = new System.Drawing.Size(577, 224);
            this.listView1.TabIndex = 4;
            this.listView1.UseCompatibleStateImageBehavior = false;
            // 
            // allowUseWallet
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(12F, 24F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.CancelButton = this.butCancel;
            this.ClientSize = new System.Drawing.Size(1040, 476);
            this.Controls.Add(this.listView1);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.butCancel);
            this.Controls.Add(this.butAllow);
            this.Controls.Add(this.txPSW);
            this.Name = "allowUseWallet";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "插件钱包签名";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox txPSW;
        private System.Windows.Forms.Button butAllow;
        private System.Windows.Forms.Button butCancel;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.ListView listView1;
    }
}