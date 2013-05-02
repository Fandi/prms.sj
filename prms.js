(function () {
	var VOID = -1;
	var LOADING = 0;
	var DONE = 1;
	var promises = {};

	var set = function (id, result) {
		if (typeof promises[id] === 'object') {
			promises[id].state = DONE;
			promises[id].value = result;

			while (promises[id] != null &&
				promises[id].defermentStacks.length > 0)
				promises[id].defermentStacks.splice(0, 1)[0].pop();
		}
	};

	var defer = function (args) {
		if (args == null ||
			args.length === 0 ||
			typeof args[0] !== 'function')
			throw new Error();

		var isdone = true;
		var defermentStack = new DefermentStack(args[0]);

		for (var i = 1; i < args.length; i++) {
			if (args[i].constructor !== Promise)
				throw new Error();

			if (promises[args[i].id].state === LOADING) {
				isdone = false;
				defermentStack.put();
				promises[args[i].id].defermentStacks.push(defermentStack);
			}
		}

		if (isdone) {
			defermentStack = null;
			args[0]();
		}

		return isdone;
	};

	var DefermentStack = function (func) {
		var count = 0;

		this.put = function () {
			count++;
		};

		this.pop = function () {
			if (--count === 0)
				func();
		};
	};

	var Promise = function (args) {
		if (args == null ||
			args.length === 0 ||
			typeof args[0] !== 'function')
			throw new Error();

		var id = Date.now().toString() + Math.random().toString();

		Object.defineProperties(this, {
			'id': {
				'value': id
			},
			'value': {
				'get': function () {
					if (promises[id] == null)
						return null;

					return (promises[id].value);
				},
				'enumerable': true
			},
			'void': {
				'value': function () {
					return (delete promises[id]);
				},
				'enumerable': true
			}
		});

		promises[id] = {
			'state': LOADING,
			'value': null,
			'defermentStacks': []
		};

		if (args.length === 1)
			args[0](function (result) {
				set(id, result);
			});
		else {
			defer([function () {
				args[0](function (result) {
					set(id, result);
				});
			}].concat(args.slice(1, args.length)));
		}
	};

	window.async = function async(func, promises_) {
		var args = new Array(arguments.length);

		for (var i = 0; i < arguments.length; i++) {
			args[i] = arguments[i];
		}

		if (args.length > 0 &&
			args[0].constructor === Promise)
			defer([function () {
				for (var i = 0; i < args.length; i++) {
					args[i].void();
				}
			}].concat(args));
		else
			return new Promise(args);
	};
})();
