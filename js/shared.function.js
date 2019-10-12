var BROWSER = chrome;
var extjQuery = jQuery.noConflict();
var common = {
    setLocal: function(data={},callback=function(){}){
        BROWSER.storage.local.set(data,callback);
    },
    getLocal: function(key,callback){
        BROWSER.storage.local.get(key,function(data){
            console.log(data,key);
            callback(data[key]);
        });
    }
};

function cleanStr(str) {
    if (typeof str !== 'undefined') {
        if (str.length)
            str = str.trim();
        str = str
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
    } else
        str = "";
    return decodeURIComponent(str);
}
function escapeHtml(str) {
    if (str != "" && typeof str != 'undefined') {
        str = str.replace(/(<([^>]+)>)/ig, " ");
    }
    return str.replace(/\s\s+/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}
