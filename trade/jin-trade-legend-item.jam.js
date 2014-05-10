/**
 * @name $jin.trade.legend.item
 * @class $jin.trade.legend.item
 * @returns $jin.trade.legend.item
 * @mixins $jin.klass
 * @mixins $jin.view
 */
$jin.klass({ '$jin.trade.legend.item': [ '$jin.view' ] })

/**
 * @name $jin.trade.legend.item#name
 * @method name
 * @member $jin.trade.legend.item
 */
$jin.atom.prop({ '$jin.trade.legend.item..name': {} })

/**
 * @name $jin.trade.legend.item#color
 * @method color
 * @member $jin.trade.legend.item
 */
$jin.atom.prop({ '$jin.trade.legend.item..color': {} })

/**
 * @name $jin.trade.legend.item#isActive
 * @method isActive
 * @member $jin.trade.legend.item
 */
$jin.atom.prop({ '$jin.trade.legend.item..isActive': {
	pull: function( ){
		return true
	}
} })
