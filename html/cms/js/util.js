if (typeof(EP) == "undefined") {
    EP = {};
}

if (typeof(EP.UTIL) == "undefined") {
    EP.UTIL = {
        htmlDecode:function(value) {
            return $('<div/>').html(value).text();
        },
        customEscape:function(str, isJson) {
            if (str != "" && str!= null) {
                str=str.replace(/[\t]/g," ");
                str=str.replace(/(&)/gm,"%26");
                str=str.replace(/(\+)/gm,"%2B");
                str=str.replace(/(=)/gm,"%3D");
                str=str.replace(/(#)/gm,"%23");
            }
            return str;
        },
        customUnEscape:function(str) {
            str=str.replace(/(&quot;)/gm,"\\\"");
            return str;
        },
        addToLocalStorage:function(key, value) {
            localStorage.setItem(key,value);
        },
        getFromLocalStorage:function(key) {
            return localStorage.getItem(key);
        },
        navigatePage:function(pageId) {
            $.mobile.pageContainer.pagecontainer("change", pageId, {transition: 'flip'});//, reload: true
        },
    }
}