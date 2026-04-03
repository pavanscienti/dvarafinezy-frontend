/**
 * custom-prototype.js
 * Custom JavaScript prototype extensions for the application.
 */

String.prototype.reverse = function () {
    return this.split("").reverse().join("");
};

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

String.prototype.toMoney = function () {
    var n = this,
        c = 2,
        d = '.',
        t = ',',
        sign = (n < 0) ? '-' : '₹ ',
        i = parseInt(n = Math.abs(n).toFixed(c)) + '',
        j = ((j = i.length) > 3) ? j % 3 : 0;
    return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
};

Number.prototype.toMoney = function () {
    var n = this,
        c = 2,
        d = '.',
        t = ',',
        sign = (n < 0) ? '-' : '₹ ',
        i = parseInt(n = Math.abs(n).toFixed(c)) + '',
        j = ((j = i.length) > 3) ? j % 3 : 0;
    return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
};

Number.prototype.zeroPad = function (len) {
    return String(this).padStart(len || 2, '0');
};

Array.prototype.contains = function (val) {
    return this.indexOf(val) !== -1;
};
