$jin.klass({ '$jin.plotter': [ '$jin.view' ] })

$jin.method({ '$jin.plotter..screen': function( ){
	return this.element().nativeNode().getContext( '2d' )
}})

$jin.method({ '$jin.plotter..colors': function( ){
	return [ '#f00', '#0a0', '#00f', '#aa0', '#a0a', '#0aa', '#390', '#039', '#903', '#309', '#930', '#093' ]
}})

$jin.atom.prop({ '$jin.plotter..rect': {
	pull: function( next ){
		var min = $jin.vector([ 0, 0 ])
		var max = $jin.vector([ 0, 0 ])
		
		var plots = this.plots()
		
		for( var id in plots ){
			var plot = plots[ id ]
			
			for( var x in plot ){
				x = Number( x )
				if( isNaN( x ) ) continue
				
				var y = plot[ x ]
				
				min = $jin.vector.merge( Math.min, min, [ x, y ] )
				max = $jin.vector.merge( Math.max, max, [ x, y ] )
			}
		}
		
		return { min: min, max: max }
	}
}})

$jin.atom.prop({ '$jin.plotter..plots': {} })

$jin.atom.prop({ '$jin.plotter..size': {
	pull: function(){
		return $jin.vector([ this.width(), this.height() ])
	}
}})

$jin.atom.prop({ '$jin.plotter..width': {
	pull: function(){
		return $jin.doc().size().x()
	}
}})

$jin.atom.prop({ '$jin.plotter..height': {
	pull: function(){
		return $jin.doc().size().y()
	}
}})

$jin.atom.prop({ '$jin.plotter..generation': {
	pull: function( prev ){
		var plots = this.plots()
		var screen = this.screen()
		var colors = this.colors()
		var rect = this.rect()
		var size = this.size()
		
		var mult = $jin.vector([ size.x() / ( rect.max.x() - rect.min.x() ), - size.y() / ( rect.max.y() - rect.min.y() ) ])
		var offset = $jin.vector([ - rect.min.x() * mult.x(), size.y() - rect.min.y() * mult.y() ])
		var plotIndex = 0
		
		screen.width = size.x()
		screen.height = size.y()
		screen.clearRect(0, 0, screen.width, screen.height )
		screen.font="25px Segoe UI"
		screen.globalAlpha = .9
		
		for( var id in plots ){
			var plot = plots[ id ]
			var color = colors[ plotIndex ]
			
			screen.beginPath()
			screen.strokeStyle = color
			
			for( var x in plot ){
				var y = plot[ x ]
				screen.lineTo( offset.x() + x * mult.x(), offset.y() + y * mult.y() )
			}
			
			screen.stroke()
			
			++ plotIndex
		}
		
		screen.fillStyle = 'gray'
		screen.textAlign = 'left'
		screen.fillText( "0", offset.x() + 5, offset.y() - 5 )
		
		return ( prev || 0 ) + 1
	}
}})