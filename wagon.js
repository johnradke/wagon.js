window.w = window.w || {};

(function(w) {
    var _ids = {};

    w.id = function id (id) {
        if (!(id in _ids)) {
            var el = document.getElementById(id);
            if (!el) {
                return el;
            } else {
                _ids[id] = el;
            }
        }

        return _ids[id];
    };

    w.cl = function cl(cl) {
        return document.getElementsByClassName(cl).toArray();
    };

    w.newDom = function newDom(tagName, properties) {
        var el = document.createElement(tagName);
        for (var prop in properties) {
            el[prop] = properties[prop];
        }

        return el;
    };

    w.html = document.getElementsByTagName('html')[0];
    w.body = document.getElementsByTagName('body')[0];

    w.go = function go (fn) {
        window.onload = fn;
    };

    w.range = function range(start, stop, step) {
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
    };

    w.pick = function pick(array) {
        return array[w.rand(array.length)];
    };

    w.rand = function rand(start, stop) {
        if (!stop) {
            stop = start;
            start = 0;
        }

        return Math.floor(Math.random() * (stop - start) + start);
    };

    w.randExclude = function randExclude(start, stop, exclusions) {
        // if there's only one exclusion, make an array of one
        exclusions.numSort();
        var realEx = [];
        exclusions.forEach(function(x) {
            if (x >= start && x < stop && realEx.indexOf(x) < 0) {
                realEx.push(x);
            }
        });

        var value = w.rand(start, stop - realEx.length);

        realEx.forEach(function(x) {
            if (value < x) {
                return value;
            }
            value ++;
        });

        return value;
    };

    w.test = function test(message, times, fn) {
        if (times instanceof Function) {
            fn = times;
            times = 1;
        }

        var tests = w.id('bedrock-tests');
        if (tests === null) {
            tests = w.newDom('ol', { id: 'bedrock-tests' });
            w.body.append(tests);
        }

        var testLi = w.newDom('li');
        var state = w.newDom('span');
        var messageDom = w.newDom('span');

        var pass;
        try {
            pass = w.range(times).all(fn);
            messageDom.appendText(message);
        }
        catch (e) {
            pass = false;
            console.error(e.stack);
            var errorDom = w.newDom('span');
            errorDom.style.color = 'red';
            errorDom.style.fontWeight = 'bold';
            errorDom.appendText('[{0}: {1}]'.format(e.name, e.message));

            messageDom.append(errorDom);
            messageDom.appendText(' ({0})'.format(message));
        }

        state.style.fontWeight = 'bold';

        if (pass){
            state.style.color = 'green';
            state.textContent = 'Pass';
        } else {
            state.style.color = 'red';
            state.textContent = 'FAIL';
        }

        testLi.append(state);
        testLi.appendText(' : ');
        testLi.append(messageDom);
        tests.append(testLi);
    };
})(window.w);

function MaxQueue(maxSize) {
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
        if (arguments.length > 1)
            arr = Array.prototype.slice.call(arguments);

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

Node.extend({
    append: Node.prototype.appendChild
})

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

Number.extend ({
    times: function(f) {
        var times = this;
        while (times--) {
            f();
        }
    }
})