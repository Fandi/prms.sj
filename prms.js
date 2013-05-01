(function () {
	var LOADING = false;
	var DONE = true;
	var promises = {};

	var Deferment = function (func) {
		var count = 0;

		this.signal = function () {
			count++
		};

		this.release = function () {
			if (--count === 0)
				func();
		};
	};

	var Promise = function (args) {
		if (args.length === 0 ||
			typeof args[0] !== 'function')
			throw new Error();

		var self = this;
		var callback = function (result) {
			if (typeof promises === 'object' &&
				promises[self.id] != null) {
				promises[self.id].state = DONE;
				promises[self.id].value = result;

				while (promises[self.id].deferments.length > 0) {
					promises[self.id].deferments.splice(0, 1)[0].release();
				}
			}
		};

		Object.defineProperties(self, {
			'id': {
				'value': Date.now().toString() + Math.random().toString(),
				'enumerable': false
			},
			'value': {
				'get': function () {
					return (promises[self.id].value);
				},
				'enumerable': true
			}
		});

		promises[self.id] = {
			'state': LOADING,
			'value': null,
			'deferments': []
		};

		if (args.length === 1)
			args[0](callback);
		else {
			var isReady = true;
			var deferment = new Deferment(function () {
				args[0](callback);
			});

			for (var i = 1; i < args.length; i++) {
				if (args[i].constructor !== Promise)
					throw new Error();

				if (promises[args[i].id].state === LOADING) {
					isReady = false;
					deferment.signal();
					promises[args[i].id].deferments.push(deferment);
				}
			}

			if (isReady)
				args[0](callback);
		}
	};

	window.async = function async(func, promises_) {
		return new Promise(arguments);
	};

	//
	window.revoke = function revoke() {
		for (var key in promises) {
			delete promises[key];
		}
	};
})();
