
/**
 * require async loads css und js files  
 * 
 * @param url An url to a file. the type of the file is detected by
 * its extension (js => Javascript, css => Stylesheet).
 * 
 * now starts the actual loading of the files. 
 * 
 * @param callback A callback, which is called if all files are
 * loaded.
 * 
 * Usage: 
 * 
 * require('/foo.js').now();
 * require('bar.js).require('test.js').now(function() {
 *     // Do something.
 * });
 */

var require = (function() { 

    var stack = [], req = null,  
    push = function(url) { 
	stack.push(url);
	return push;
    },

    handlers = {
	"js": function(url, callback) { 
	    var req = new XMLHttpRequest();
            req.open('get', url, true);
	    
	    req.onreadystatechange = function() { 
		if(req.readyState === 4 && req.status === 200) {	      
		    var se = document.createElement('script');
		    document.getElementsByTagName('head')[0].appendChild(se);
		    se.text = req.responseText;
		    return callback();
		}
	    }
	    
            req.send();
	},

	"css": function(url, callback) { 
	    var link = document.createElement('link');
	    link.setAttribute('rel', 'stylesheet');
	    link.setAttribute('type', 'text/css');
	    link.setAttribute('href', url);
	    document.getElementsByTagName('head')[0].appendChild(link);
	    return callback();
	}
    };
    
    push.now = function(callback) { 
	if(stack.length > 0) { 
	    var url =  stack.shift(),
	    ext = url.match(/\.([^\.]+)$/)[1];
	    
	    if(handlers[ext] !== undefined) { 
		handlers[ext](url, function() { 
		    return (stack.length === 0) ? callback() : (callback !== undefined) ? push.now(callback) : "";			
		});
	    }
	}
	return push; 
    };
    push.require = push; 

    return push; 
})();

