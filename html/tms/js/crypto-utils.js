/**
 * AES Encryption Utility
 * Matches Java backend AES/ECB/PKCS5Padding decryption
 */

var SECRET_KEY = 'Dvara@KGFS#2026$';

function encryptPassword(password) {
    var key = CryptoJS.enc.Utf8.parse(SECRET_KEY.substring(0, 16));
    var encrypted = CryptoJS.AES.encrypt(
        password,
        key,
        {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }
    );
    return encrypted.toString(); // Base64 string
}

function encryptValue(value) {
    if (!value) return value;
    return encryptPassword(String(value));
}
