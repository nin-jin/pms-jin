/**
 * Атом - минимальный кирпичик реактивного приложения. Умеет:
 *
 *  * хранит в себе значение или ошибку (value)
 *  * обладает состоянием (status)
 *  * лениво вычисляет значение (pull) и автоматически подписываться на изменения значений атомов, от которых зависит (obey).
 *  * вызывать обработчики в случае изменения значения (push) или возникновении ошибки (fail)
 *  * сливать новое значение с предыдущим через колбэк (merge)
 *
 * @name $jin.atom
 * @class $jin.atom
 * @cfg {string} name - Имя атома. Используется для отладки. Старайтесь давать атомам уникальные имена.
 * @cfg {any} value - Исходное значение атома. undefined в качестве значения означает, что оно не определено и его надлежит вычислить.
 * @cfg {Error} error - Объект ошибки. При попытке получения значения атома извне она будет бросаться в качестве исключения.
 * @cfg {function( prev )} pull - Функция ленивого вычисления значения.
 * @cfg {function( next, prev )} push - Обработчик изменения значения. В качестве аргументов принимает новое и старое значения.
 * @cfg {function( next, prev )} merge - Функция слияния нового значения со старым. Вызывается перед записью нового значения. Может валидировать, нормализовывать и даже отменять изменение.
 * @cfg {function( error )} fail - Обработчик возникновения ошибки.
 * @cfg {object} context - Контекст в котором вызываются все обработчики.
 * @returns $jin.atom
 * @mixins $jin.klass
 * @mixins $jin.atom.variable
 * @mixins $jin.atom.pullable
 * @mixins $jin.atom.mergable
 * @mixins $jin.atom.pushable
 */

/**
 * @name $jin.atom
 * @class $jin.atom
 * @mixins $jin.klass
 * @returns $jin.atom
 */
$jin.klass({ '$jin.atom': [
	'$jin.atom.variable',
	'$jin.atom.pullable',
	'$jin.atom.getable',
	'$jin.atom.clearable',
	'$jin.atom.mergable',
	'$jin.atom.pushable',
	'$jin.atom.failable'
]})

$jin.glob( '$jin.atom.current', null )

/**
 * Исключение, которое можно бросить в атоме, чтобы прервать вычисление всей текущей цепочки атомов.
 *
 * На любом уровне его можно либо перехватить через try-catch, либо обработать через fail метод атома.
 *
 * @name $jin.atom.wait
 * @class $jin.atom.wait
 * @mixins $jin.error
 * @returns $jin.atom.wait
 */
$jin.error({ '$jin.atom.wait': [] })

/**
 * Временно отключить автоматическое слежение за зависимостями, выполнить функцию и включить слежение обратно.
 * Возвращает то, что вернула функция.
 *
 * @name $jin.atom.bound
 * @method bound
 * @param {function} handler
 * @static
 * @member $jin.atom
 */
$jin.method({ '$jin.atom.bound': function( handler ){
	var slave = this.current
	this.current = null
	var res = handler()
	this.current = slave
	return res
}})

/**
 * @name $jin.atom#init
 * @method init
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..init': function( config ){
	
	this['$jin.atom.pullable..init']( config )
	
	if( config.get ) this._get = config.get
	if( config.pull ) this._pull = config.pull
	if( config.merge ) this._merge = config.merge
	if( config.push ) this._push = config.push
	if( config.fail ) this._fail = config.fail
	if( config.clear ) this._clear = config.clear
}})

/**
 * @name $jin.atom#_get
 * @method _get
 * @member $jin.atom
 */
$jin.method({ '$jin.atom.._get': function( prev ){
	return prev
}})

/**
 * @name $jin.atom#_pull
 * @method _pull
 * @member $jin.atom
 */
$jin.method({ '$jin.atom.._pull': function( prev ){
	return prev
}})

/**
 * @name $jin.atom#_merge
 * @method _merge
 * @member $jin.atom
 */
$jin.method({ '$jin.atom.._merge': function( next ){
	return next
} })

/**
 * @name $jin.atom#_push
 * @method _push
 * @member $jin.atom
 */
$jin.method({ '$jin.atom.._push': function( ){ } })

/**
 * @name $jin.atom#_fail
 * @method _fail
 * @member $jin.atom
 */
$jin.method({ '$jin.atom.._fail': function( error ){
	$jin.log.error( error )
} })

/**
 * @name $jin.atom#_clear
 * @method _clear
 * @member $jin.atom
 */
$jin.method({ '$jin.atom.._clear': function( ){ } })
