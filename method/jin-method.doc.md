	$jin.method - регистрирует функцию в качестве метода какого-либо глобально доступного объекта.
	
	“ипичный пример:
	
	$jin.method({ '$my.app.init': funciton( ){
		console.log( 'init' )
	}})
	
	“еперь можно вызвать еЄ, например, так:
	
	$my.app.init()
	
	ƒвойна€ точка означает свойство prototype:
	
	$my.cat = function(){}
	$jin.method({ '$my.cat..mew': funciton( ){
		console.log( 'mew' )
	}})
	
	;(new $my.cat).mew()
	
	Ќе допускаетс€ случайное переопределение существующего метода:
	
	$jin.method({ '$my.app.init': function( ){
		console.log( 'init' )
	}})
	
	$jin.method({ '$my.app.init': function( ){
		console.log( 'init2' )
	}})
	
	$my.app.init() // тут будет исключение
	
	„тобы намеренно переопределить метод, нужно упом€нуть полное им€ переопредел€емого метода в теле функции:
	
	$jin.method({ '$my.app.init': function( ){
		console.log( 'init' )
	}})
	
	$jin.method({ '$my.app.init2': function( ){
		override: '$my.app.init'
		console.log( 'init2' )
	}})
	
	$jin.method({ '$my.app.init': $my.app.init2 })
	
	$my.app.init() // тут будет выведено только init2
	
	Ќо зачастую надо не просто переопредел€ть, а дополн€ть исходный метод. ¬се регистрируемые методы доступны в объекте по полному имени:

	$jin.method({ '$my.app.init': function( ){
		console.log( 'init' )
	}})
	
	$jin.method({ '$my.app.init2': function( ){
		this['$my.app.init']()
		console.log( 'init2' )
	}})
	
	$jin.method({ '$my.app.init': $my.app.init2 })
	
	$my.app.init() // тут будет выведено init, а потом init2

	ѕочему используетс€ такой странный синтаксис регистрации методов?
	+ отслеживаютс€ конфликты, когда один метод случайно затирает другой
	+ автоматически создаютс€ промежуточные неймспейсы
	+ в дебагере и профайлере хрома и ие выводитс€ полное им€ вида "$jin.method.$my.app.init2" вместо абстрактного "(anonymous function)"
	+ возможность определ€ть методы в произвольном пор€дке
	
	Ќедостатки:
	- несколько громоздка€ запись
	- IDE без специальных JSDoc-ов не понимают что тут происходит
	
	 ак писать JSDoc дл€ IDE:
	
	/** @name $my.cat#mew */
	$jin.method({ '$my.cat..mew': function( ){
		console.log( 'mew' )
	}})
	
	¬озможно стоит заменить двойную точку на решЄтку дл€ универсальности. “акже возможно имеет смысл сделать автогенератор JSDoc-ов.
	
	$jin.method({ '$my.app.init2': function( ){
		this['$my.app.init']()
		console.log( 'init2' )
	}})
	
	$jin.method({ '$my.app.init': $my.app.init2 })
	
	$jin.method({ '$my.app.init': function( ){
		console.log( 'init' )
	}})
	
	$my.app.init() // тут будет выведено init, а потом init2
