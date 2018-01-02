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
            this.txPSW.Location = new System.Drawing.Point(24, 158);
            this.txPSW.Margin = new System.Windows.Forms.Padding(2, 2, 2, 2);
            this.txPSW.Name = "txPSW";
            this.txPSW.PasswordChar = '*';
            this.txPSW.Size = new System.Drawing.Size(290, 21);
            this.txPSW.TabIndex = 0;
            // 
            // butAllow
            // 
            this.butAllow.DialogResult = System.Windows.Forms.DialogResult.OK;
            this.butAllow.Location = new System.Drawing.Point(140, 188);
            this.butAllow.Margin = new System.Windows.Forms.Padding(2, 2, 2, 2);
            this.butAllow.Name = "butAllow";
            this.butAllow.Size = new System.Drawing.Size(95, 40);
            this.butAllow.TabIndex = 1;
            this.butAllow.Text = "同意";
            this.butAllow.UseVisualStyleBackColor = true;
            this.butAllow.Click += new System.EventHandler(this.butAllow_Click);
            // 
            // butCancel
            // 
            this.butCancel.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.butCancel.Location = new System.Drawing.Point(24, 188);
            this.butCancel.Margin = new System.Windows.Forms.Padding(2, 2, 2, 2);
            this.butCancel.Name = "butCancel";
            this.butCancel.Size = new System.Drawing.Size(97, 40);
            this.butCancel.TabIndex = 2;
            this.butCancel.Text = "取消";
            this.butCancel.UseVisualStyleBackColor = true;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("宋体", 14.25F, ((System.Drawing.FontStyle)(((System.Drawing.FontStyle.Bold | System.Drawing.FontStyle.Italic) 
                | System.Drawing.FontStyle.Underline))), System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.label1.Location = new System.Drawing.Point(22, 128);
            this.label1.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(329, 19);
            this.label1.TabIndex = 3;
            this.label1.Text = "如确认，请输入钱包密码并按同意：";
            // 
            // listView1
            // 
            this.listView1.Location = new System.Drawing.Point(24, 6);
            this.listView1.Margin = new System.Windows.Forms.Padding(2, 2, 2, 2);
            this.listView1.Name = "listView1";
            this.listView1.Size = new System.Drawing.Size(290, 114);
            this.listView1.TabIndex = 4;
            this.listView1.UseCompatibleStateImageBehavior = false;
            this.listView1.View = System.Windows.Forms.View.List;
            // 
            // allowUseWallet
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.CancelButton = this.butCancel;
            this.ClientSize = new System.Drawing.Size(520, 271);
            this.Controls.Add(this.listView1);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.butCancel);
            this.Controls.Add(this.butAllow);
            this.Controls.Add(this.txPSW);
            this.Margin = new System.Windows.Forms.Padding(2, 2, 2, 2);
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