module $jin {
	export function when( list : any ) {

		var response = new $jin.atom.prop<any,any>({})
		var values = []
		var awaitCount = 0

		function makeHandler(key) {
			return function (value) {
				values[key] = value
				if (!--awaitCount) response.push(values)
			}
		}

		for (var key in list) {
			++awaitCount
			var handle = makeHandler(key)
			list[key].then(handle, handle)
		}

		return response
	}
}