class Info extends $jin.object {
    
    item( key : string ){
        return new $jin.atom.prop<string>( {
            owner : this,
            name : '_item:' + key,
            pull : prev => 'content of ' + key
        } )
    }
    
}

var i = new Info
i.item( 'foo' ).push( 'foo content' )
console.log( i.item( 'bar' ).get() )
