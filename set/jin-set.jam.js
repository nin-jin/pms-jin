/**
 * Упорядоченное множество.
 * Попытка добавления уже существующего элемента игнорируется.
 * Уникальность определяется по строковому представлению элемента.
 * Для быстрого поиска смещений хранит внутри себя индекс.
 * 
 * Сложность:
 * indexOf - первый раз O(length), далее O(1).
 * push - O(1).
 * pop - O(1).
 * shift - O(1).
 * unshift - O(1).
 * splice - будет O(del+add+tail), пока использовать нельзя ибо ломает индекс.
 * reverse - O(length), пока использовать нельзя ибо ломает индекс.
 * 
 * @name $jin.set
 * @class $jin.set
 * @returns $jin.set
 * @method collection
 * @member $jin
 * @static
 */

/**
 * @name $jin.set#index
 * @method index
 * @member $jin.set
 * @static
 */
$jin.property({ '$jin.set..index': function( ){
	var index = {}
	
	for( var i = 0; i < this.length; ++i ){
		index[ this[ i ] ] = i
	}
	
	return index
}})

/**
 * @name $jin.set#indexOffset
 * @method indexOffset
 * @member $jin.set
 */
$jin.property({ '$jin.set..indexOffset': function( offset ){
	if( arguments.length ) return offset
	return 0
}})

/**
 * @name $jin.set#indexOf
 * @method indexOf
 * @member $jin.set
 */
$jin.method({ '$jin.set..indexOf': function( value ){
	var index = this.index()[ value ]
	return ( index === void 0 ) ? -1 : index + this.indexOffset()
}})

/**
 * @name $jin.set#unshift
 * @method unshift
 * @member $jin.set
 */
$jin.method({ '$jin.set..unshift': function( value ){
	var index = this.index()
	if( index[ value ] !== void 0 ) return
	
	++this.indexOffset
	index[ value ] = -this.indexOffset
	
	return Array.prototype.unshift.call( this, value )
}})

/**
 * @name $jin.set#shift
 * @method shift
 * @member $jin.set
 */
$jin.method({ '$jin.set..shift': function( ){
	var index = this.index()
	
	if( this.length > 0 ){
		delete index[ this[0] ]
		--this.indexOffset
	}
	
	return Array.prototype.shift.call( this )
}})

/**
 * @name $jin.set#push
 * @method push
 * @member $jin.set
 */
$jin.method({ '$jin.set..push': function( value ){
	var index = this.index()
	if( index[ value ] !== void 0 ) return
	
	index[ value ] = this.length
	
	return Array.prototype.push.call( this, value )
}})

/**
 * @name $jin.set#pop
 * @method pop
 * @member $jin.set
 */
$jin.method({ '$jin.set..pop': function( ){
	var index = this.index()
	
	if( this.length > 0 ){
		delete index[ this[ this.length - 1 ] ]
	}
	
	return Array.prototype.pop.call( this )
}})
