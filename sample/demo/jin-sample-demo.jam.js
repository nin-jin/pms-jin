/**
 * @name $jin.sample.demo
 * @class $jin.sample.demo
 * @mixins $jin.klass
 * @mixins $jin.view
 * @returns $jin.sample.demo
 */
$jin.klass({ '$jin.sample.demo': [ '$jin.view' ] })

/**
 * @name $jin.sample.demo.strings
 * @method strings
 * @static
 * @member $jin.sample.demo
 */
$jin.atom.prop({ '$jin.sample.demo.strings': {
	value: '',
	put: function( next, prev ){
		return $jin.sample.demo.strings() + next
	}
}})

/**
 * @name $jin.sample.demo.tree
 * @method tree
 * @static
 * @member $jin.sample.demo
 */
$jin.atom.prop({ '$jin.sample.demo.tree': {
	pull: function( ){
		var strings = this.strings()
		if( !strings ) throw new Error( 'Please, set up $jin.sample.demo.strings' )
		return $jin.tree.parse( $jin.sample.demo.strings() )
	}
}}) 

/**
 * @name $jin.sample.demo#title
 * @method title
 * @member $jin.sample.demo
 */
$jin.atom.prop({ '$jin.sample.demo..title': {} })

/**
 * @name $jin.sample.demo#size
 * @method size
 * @member $jin.sample.demo
 */
$jin.atom.prop({ '$jin.sample.demo..size': {} })

/**
 * @name $jin.sample.demo#content
 * @method content
 * @member $jin.sample.demo
 */
$jin.atom.prop({ '$jin.sample.demo..content': {} }) 

/**
 * @name $jin.sample.demo.list
 * @class $jin.sample.demo.list
 * @mixins $jin.klass
 * @mixins $jin.view
 * @returns $jin.sample.demo.list
 */
$jin.klass({ '$jin.sample.demo.list': [ '$jin.view' ] })

/**
 * @name $jin.sample.demo.list#items
 * @method items
 * @member $jin.sample.demo.list
 * @static
 */
$jin.atom.prop({ '$jin.sample.demo.list..items': {
	pull: function( ){
		function makeValues( sub, view ){
			if( typeof sub === 'string' ) return sub
			if( sub.name()[0] === '-' ){
				return $jin.sample( view.htmlID() + sub.name() ).view( view )
			}
			if( /-/.test( sub.name() ) ){
				var view2 = Object.create( view || null )
				view2.id = $jin.value( sub.name() + ':' + $jin.makeId( sub.name() ) )
				view2.htmlID = $jin.value( sub.name() )
				sub.content().forEach( function( prop ){
					var val = prop.content().map( function( sub ){
						return makeValues( sub, view2 )
					})
					view2[ prop.name() ] = $jin.value( val )
				} )
				return $jin.sample( view2.htmlID() ).view( view2 )
			}
			return String( sub )
		}
		return $jin.sample.demo.tree().content().map( function( sub ){
			return makeValues( sub )
		} )
	}
}}) 

/**
 * @name $jin.sample.demo.print
 * @method print
 * @member $jin.sample.demo
 * @static
 */
$jin.method({ '$jin.sample.demo.print': function( ){
	$jin.sample.demo.list( 'jin-sample-demo-list' ).element().parent( document.body )
}})
