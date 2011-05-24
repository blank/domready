/**
 *  domready.js - Specify a function to execute when the DOM is fully loaded.
 *  Copyright (c) 2011 Blank Zheng (blankzheng@gmail.com)
 *  http://www.planabc.net
 */

(function (doc, win) {
    var isReady = 0,
        isBind = 0,
        fns = [],
        testEl = doc.createElement('p'),
        bindReady,
        init;

        win.domReady = function(fn){
            bindReady(fn);

            if (isReady) {
                fn();
            } else {
                fns.push(fn);
            }
        };

        bindReady = function (){
            if(isBind) return;
            isBind = 1;

            // Catch cases where domReady is called after the browser event has already occurred.
            // readyState: "uninitalized"、"loading"、"interactive"、"complete" 、"loaded"
            if(doc.readyState === "complete") {
                init();
            } else if (doc.addEventListener) {
                doc.addEventListener("DOMContentLoaded", function () {
                    doc.removeEventListener("DOMContentLoaded", arguments.callee, false);
                    init();
                }, false);
                win.addEventListener("onload", init, false);
            } else if(doc.attachEvent) {
                // For a frame
                doc.attachEvent("onreadystatechange", function() {
                    if (doc.readyState === "complete") {
                        doc.detachEvent("onreadystatechange", arguments.callee);
                        init();
                    }
                });
                win.attachEvent("onload", init);

                // If IE and not a frame, continually check to see if the document is ready.
                if(testEl.doScroll && win == win.top){
                    doScrollCheck();
                }
            }
        };

        // Process items when the DOM is ready.
        init = function () {
            isReady = 1;

            // Make sure body exists, at least, in case IE gets a little overzealous.
            // This is taked directly from jQuery's implementation.
            if (!doc.body) {
                setTimeout(init, 10);
                return;
            }

            for (var i = 0, l = fns.length; i < l; i++) {
                fns[i]();
            }
            fns = [];
        };

        function doScrollCheck() {
            if(isReady) return;

            try {
                // If IE is used, use the trick by Diego Perini
                // http://javascript.nwbox.com/IEContentLoaded/
                testEl.doScroll('left');
            } catch (e) {
                setTimeout(doScrollCheck, 10);
                return;
            }
            
            init();
        }

})(document, window);

/**
 * Ref:
 * http://www.planabc.net/2009/07/30/adddomloadevent/
 * https://github.com/ded/domready/blob/master/ready.js
 * https://github.com/Cu7l4ss/DomReady-script/blob/master/DomReady.js
 * https://github.com/jakobmattsson/onDomReady/blob/master/ondomready.js
 **/