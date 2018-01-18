using Neo.Cryptography;
using Neo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace BrowserPluginWallet
{
    class neoHelper
    {
        public static string ToHexString(IEnumerable<byte> value)
        {
            StringBuilder sb = new StringBuilder();
            foreach (byte b in value)
                sb.AppendFormat("{0:x2}", b);
            return sb.ToString();
        }

        public static byte[] Base58CheckDecode(string input)
        {
            byte[] buffer = Base58.Decode(input);
            if (buffer.Length < 4) throw new FormatException();
            byte[] checksum = buffer.Sha256(0, buffer.Length - 4).Sha256();
            if (!buffer.Skip(buffer.Length - 4).SequenceEqual(checksum.Take(4)))
                throw new FormatException();
            return buffer.Take(buffer.Length - 4).ToArray();
        }

        internal static byte[] AES256Decrypt(byte[] block, byte[] key)
        {
            using (Aes aes = Aes.Create())
            {
                aes.Key = key;
                aes.Mode = CipherMode.ECB;
                aes.Padding = PaddingMode.None;
                using (ICryptoTransform decryptor = aes.CreateDecryptor())
                {
                    return decryptor.TransformFinalBlock(block, 0, block.Length);
                }
            }
        }

        private static byte[] XOR(byte[] x, byte[] y)
        {
            //if (x.Length != y.Length) throw new ArgumentException();
            return x.Zip(y, (a, b) => (byte)(a ^ b)).ToArray();
        }

        public static byte[] GetPrivateKeyFromNEP2(string nep2, string passphrase, int N = 16384, int r = 8, int p = 8)
        {
            //if (nep2 == null) throw new ArgumentNullException(nameof(nep2));
            //if (passphrase == null) throw new ArgumentNullException(nameof(passphrase));

            byte[] data = Base58CheckDecode(nep2);
            var dataStr = data.ToHexString();
            //0142e05f50e9507f66015665c07c9d42645f38a15efc7895e2dee07110d0edf10b30cafbcdccc5

            //if (data.Length != 39 || data[0] != 0x01 || data[1] != 0x42 || data[2] != 0xe0)
            //    throw new FormatException();

            byte[] addresshash = new byte[4];
            Buffer.BlockCopy(data, 3, addresshash, 0, 4);
            var addresshashStr = addresshash.ToHexString();
            //5f50e950

            byte[] derivedkey = SCrypt.DeriveKey(Encoding.UTF8.GetBytes(passphrase), addresshash, N, r, p, 64);
            var derivedkeyStr = derivedkey.ToHexString();
            //179d95651ca3c7b47b86fef395f597da3214c7e057b440febf7e40e9c0fb51b04936b4c2a3f7e29e40dfad46e4a0b0b320cc72b735c8d77b0030e68869d57e69

            byte[] derivedhalf1 = derivedkey.Take(32).ToArray();
            var derivedhalf1Str = derivedhalf1.ToHexString();
            //179d95651ca3c7b47b86fef395f597da3214c7e057b440febf7e40e9c0fb51b0

            byte[] derivedhalf2 = derivedkey.Skip(32).ToArray();
            var derivedhalf2Str = derivedhalf2.ToHexString();
            //4936b4c2a3f7e29e40dfad46e4a0b0b320cc72b735c8d77b0030e68869d57e69

            byte[] encryptedkey = new byte[32];
            Buffer.BlockCopy(data, 7, encryptedkey, 0, 32);
            var encryptedkeyStr = encryptedkey.ToHexString();
            //7f66015665c07c9d42645f38a15efc7895e2dee07110d0edf10b30cafbcdccc5

            byte[] prikey = XOR(AES256Decrypt(encryptedkey,derivedhalf2), derivedhalf1);
            var prikeyStr = prikey.ToHexString();
            //25228cd2b2aeb4fec8065cadab8dc28cb618fba3a789853fcda357c37f0864c1

            //Cryptography.ECC.ECPoint pubkey = Cryptography.ECC.ECCurve.Secp256r1.G * prikey;
            //UInt160 script_hash = Contract.CreateSignatureRedeemScript(pubkey).ToScriptHash();
            //string address = ToAddress(script_hash);
            //if (!Encoding.ASCII.GetBytes(address).Sha256().Sha256().Take(4).SequenceEqual(addresshash))
            //    throw new FormatException();

            return prikey;
        }

        public static byte[] getPublickeyFromPrivateKey(byte[] privateKey)
        {
            return (Neo.Cryptography.ECC.ECCurve.Secp256r1.G * privateKey).EncodePoint(true);
        }
    }
}
