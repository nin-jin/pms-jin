$jin.klass({ '$jin.trade.legend.item': [ '$jin.view' ] })

$jin.atom.prop({ '$jin.trade.legend.item..name': {} })

$jin.atom.prop({ '$jin.trade.legend.item..color': {} })

$jin.atom.prop({ '$jin.trade.legend.item..isActive': {
	pull: function( ){
		return true
	}
} })
