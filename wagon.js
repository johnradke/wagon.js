
var $ = function() {
    var _ids = {};

    function _id (id) {
        if (!(id in _ids)) {
            _ids[id] = document.getElementById(id);
        }

        return _ids[id];
    }

    function _cl(cl) {
        return document.getElementsByClassName(cl).toArray();
    }

    var _html = document.getElementsByTagName('html')[0];
    var _body = document.getElementsByTagName('body')[0];

    function _go (fn) {
        window.onload = fn;
    }

    function _range(start, stop, step) {
        if (!stop) {
            stop = start;
            start = 0;
        }

        if (!step) step = 1;
        
        var r = [];

        for (var i = start; i < stop; i += step) {
            r.push(i);
        }

        return r;
    }

    function _rand(start, stop) {
        if (!stop) {
            stop = start;
            start = 0;
        }

        return Math.floor(Math.random() * (stop - start) + start);
    }

    function _randExclude(start, stop, exclusions) {
        // if there's only one exclusion, make an array of one
        exclusions.numSort();
        var realEx = [];
        exclusions.forEach(function(x) {
            if (x >= start && x < stop && realEx.indexOf(x) < 0) {
                realEx.push(x);
            }
        });

        var value = _rand(start, stop - realEx.length);

        realEx.forEach(function(x) {
            if (value < x) {
                return value;
            }
            value ++;
        });

        return value;
    }

    function _test(message, times, fn) {
        if (times instanceof Function) {
            fn = times;
            times = 1;
        }

        var tests = document.getElementById('bedrock-tests');
        if (tests === null) {
            tests = document.createElement('ol');
            tests.id = 'bedrock-tests';
            _body.appendChild(tests);
        }

        var test = document.createElement('li');
        var state = document.createElement('span');

        var pass = $.range(times).all(fn);
        if (pass){
            state.style.color = 'green';
            state.textContent = 'Pass';
        } else {
            state.style.color = 'red';
            state.textContent = 'FAIL';
        }

        test.appendChild(state);
        test.appendText(' - ' + message);
        tests.appendChild(test);
    }

    return {
        id: _id,
        cl: _cl,
        html: _html,
        body: _body,
        go: _go,
        range: _range,
        rand: _rand,
        randExclude: _randExclude,
        test: _test
    };
}();

function MaxQueue(maxSize) {
    var start = 0;

    this.Add = function(item) {
        if (this.length == maxSize)
            this.pop();

        this.unshift(item);
    }
}

MaxQueue.prototype = new Array()

Object.defineProperties(Object.prototype, { extend: { enumerable: false, value: function(options) {
    for (var opt in options) {
        Object.defineProperty(this.prototype, opt, { enumerable: false, value: options[opt] });
    }
}}});

Object.extend({
    map: function(func) {
        var newObj = {};
        for (var o in this) {
            newObj[o] = func(this[o]);
        }
        return newObj;
    },
    in: function(arr) {
        arr.any(function(item) { return this === item; });
    }
});

Array.extend({
    reduce: function(func) {
        var best = this[0];
        for (var i = 1; i < this.length; i++) {
            best = func(best, this[i]);
        }
        return best;
    },
    mult: function(multiplier) {
        return this.map(function(n){
            return n * multiplier;
        });
    },
    numSort: function() {
        this.sort(function(a, b) { return a - b; });
    },
    pushArray: function(array) {
        Array.prototype.push.apply(this, array);
    },
    all: function(predicate) {
        this.forEach(function(item) {
            if (!predicate(item)) return false;
        });

        return true;
    },
    any: function(predicate) {
        this.forEach(function(item) {
            if (predicate(item)) return true;
        });

        return false;
    }
});

String.extend({
    format: function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
          return typeof args[number] != 'undefined'
            ? args[number]
            : match
          ;
        });
    }
});

NodeList.extend({
    toArray: function() {
        // http://jsperf.com/nodelist-to-array
        var arr = [];
        for (var i = 0, ref = arr.length = this.length; i < ref; i++) {
            arr[i] = this[i];
        }
        return arr;
    }
});

HTMLCollection.extend({
    toArray: function() {
        // http://jsperf.com/nodelist-to-array
        var arr = [];
        for (var i = 0, ref = arr.length = this.length; i < ref; i++) {
            arr[i] = this[i];
        }
        return arr;
    }
});

HTMLElement.extend ({
    appendText: function(text) {
        this.appendChild(document.createTextNode(text));
    },
    removeAll: function() {
        while(this.firstChild) {
            this.removeChild(this.firstChild);
        }
    },
    setText: function(text) {
        this.removeAll();
        this.appendText(text);
    }
})