this.$jin.trait = function( name ){
    
    var trait = $jin.glob( name )
    if( trait ) return trait
    
    trait = $jin.trait.make( name )
    
    return $jin.glob( name, trait )
}

this.$jin.trait.make = function( name ){
    
    var trait = function( args ){
        if( this instanceof trait ){
            return this.init.apply( this, args || [] )
        } else {
            return trait.exec.apply( trait, arguments )
        }
    }

    trait.jin_method_path = name
    
    return trait
}
