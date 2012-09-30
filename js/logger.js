/**
 * IE is lame, but in case I ever decide to support it, I need to make sure it
 * doesn't blow up the game because it can't handle logging
 */
var logger = (function() {

    var isConsoleSupported = typeof console !== "undefined"
      && typeof console.log !== "undefined"
      && typeof console.error !== "undefined";

    function log(msg) {
        if (isConsoleSupported) {
            console.log(msg);
        }
    }
    function error(msg) {
        if (isConsoleSupported) {
            console.error(msg);
        }
    }

    return {
        log: log,
        error: error
    }
})();