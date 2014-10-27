/**
 * @name $jin.trade
 * @class $jin.trade
 * @mixins $jin.klass
 * @mixins $jin.view
 * @returns $jin.trade
 */
$jin.klass({ '$jin.trade': [ '$jin.view' ] })

/**
 * @name $jin.trade#graph
 * @method graph
 * @member $jin.trade
 */
$jin.atom1.prop({ '$jin.trade..graph': {
	pull: function( ){
		try {
			return this.make( 'graph', $jin.plotter ).plots( this.plots() )
		} catch( error ){
			return error.message
		}
	}
}})

/**
 * @name $jin.trade#plots
 * @method plots
 * @member $jin.trade
 */
$jin.atom1.prop({ '$jin.trade..plots': {
	pull: function( ){
		var next = {}
		
		next.btc2usd = this.history()
		next.volume = this.volume()
		
		var strategies = this.strategies()
		var fees = this.fees()
		var startBudget = this.startBTC() 
		
		for( var strategyId in strategies ){
			var strategy = new strategies[ strategyId ]
			
			var strategyHistory = Array( next.btc2usd.length )
			var btc = startBudget
			var usd = 0
			var maxBudget = 0
			
			for( var index = 0; index < next.btc2usd.length; ++index ){
				var value = next.btc2usd[ index ]
				var command = strategy.learn( value, budget, fees )
				
				if( command === 'exchange' ){
					command = btc ? 'prefer-usd' : 'prefer-btc'
				}
				
				if( command === 'prefer-btc' && usd > 0 ){
					usd -= usd * fees
					btc += usd / value
					usd = 0
				}
				
				if( command === 'prefer-usd' && btc > fees ){
					btc -= btc * fees
					usd += btc * value
					btc = 0
				}
				
				var budget = usd + btc * value
				if( budget > maxBudget ) maxBudget = budget
				
				strategyHistory[ index ] = budget / startBudget
				
				if( budget < maxBudget * .66 ) break;
				if( budget < startBudget * .9 ) break;
			}
			
			next[ strategyId ] = strategyHistory
		}
		
		return next
	}
}})

/**
 * @name $jin.trade#legend
 * @method legend
 * @member $jin.trade
 */
$jin.atom1.prop({ '$jin.trade..legend': {
	pull: function( ){
		var plots = this.plots()
		var colors = this.graph().colors()
		var items = []
		var index = 0
		for( var name in plots ){
			items.push( this.make( name, $jin.trade.legend.item ).name( name ).color( colors[ index ] ) )
			++index
		}
		return items
	}
}})

/**
 * @name $jin.trade#history
 * @method history
 * @member $jin.trade
 */
$jin.atom1.prop({ '$jin.trade..history': {
	pull: function( prev ){
		var history = $jin.state.local.item( this.id() + ';history' )
		if( history ){
			var time = Number( $jin.state.local.item( this.id() + ';history;time' ) ) || 0
			history = history.split( ',' ).map( Number )
		}
		
		if( !time || ( time + 1000 * 60 * 5 ) < Date.now() ){
			var id = 'jin_trade_jsonp_' + Date.now()
			var script = document.createElement( 'script' )
			var url = 'https://www.cryptsy.com/json/ajaxtradechartmonth_3.json?callback=' + id
			script.src = 'http://jsonp.jit.su/?url=' + encodeURIComponent( url ) + '&callback=' + id
			window[ id ] = function( data ){
				delete window[ id ]
				document.body.removeChild( script )
				var history = data.map( function( moment ){
					return 1 / moment[ 1 ] // open
				})
				$jin.state.local.item( this.id() + ';history', history )
				$jin.state.local.item( this.id() + ';history;time', Date.now() )
			}.bind( this )
			document.body.appendChild( script )
		}
		
		if( !history ) throw $jin.atom1.wait( 'Loading month history from cryptsy.com...' )
		
		return history
	}
}})

/**
 * @name $jin.trade#volume
 * @method volume
 * @member $jin.trade
 */
$jin.atom1.prop({ '$jin.trade..volume': {
	pull: function( ){
		var history = this.history()
		var last = history[0]
		return history.map( function( value, index ){
			var volume = value - last
			last = value
			return volume
		} )
	}
}})

/**
 * @name $jin.trade#fees
 * @method fees
 * @member $jin.trade
 */
$jin.atom1.prop({ '$jin.trade..fees': {
	pull: function( ){
		return 0.003
	}
}})

/**
 * @name $jin.trade#startBTC
 * @method startBTC
 * @member $jin.trade
 */
$jin.atom1.prop({ '$jin.trade..startBTC': {
	pull: function( ){
		return 1
	}
}})

/**
 * @name $jin.trade#strategies
 * @method strategies
 * @member $jin.trade
 */
$jin.atom1.prop({ '$jin.trade..strategies': {
	pull: function( ){
		var next = {}
		
		next.randomStrategy = function( ){
			this.learn = function( value ){
				if( Math.random() < .02 ) return 'exchange'
			}
		}
		
		next.proStrategy = function( ){
			this.last
			this.learn = function( value ){
				if( this.last === void 0 ) this.last = value
				var last = this.last
				this.last = value
				if( value < last ) return 'prefer-usd'
				if( value > last ) return 'prefer-btc'
			}
		}
		
		next.contraStrategy = function( ){
			this.last
			this.learn = function( value ){
				if( this.last === void 0 ) this.last = value
				var last = this.last
				this.last = value
				if( value < last ) return 'prefer-btc'
				if( value > last ) return 'prefer-usd'
			}
		}
		
		next.safeContraStrategy = function( ){
			this.last
			this.learn = function( value, budget, fees ){
				if( this.last === void 0 ) this.last = value
				var last = this.last
				this.last = value
				if( value - last < - fees * value * 2 ) return 'prefer-btc'
				if( value - last > + fees * value * 2 ) return 'prefer-usd'
				//this.last = last
			}
		}
		
		next.safeProStrategy = function( ){
			this.last
			this.learn = function( value, budget, fees ){
				if( this.last === void 0 ) this.last = value
				var last = this.last
				this.last = value
				if( value < last - fees * value * 5 ) return 'prefer-usd'
				if( value > last + fees * value * 5 ) return 'prefer-btc'
			}
		}
		
		return next
	}
}})
