module $jin {
    
    export function handler < HandlerType extends Function > ( handler : HandlerType ) {
        var wrappers = $jin.handler.wrappers
        for( var i = wrappers.length - 1 ; i >= 0 ; --i ){
            handler = wrappers[i]( handler )
        }
        return handler
    }
    
    module handler {
        export var wrappers = []
    }
    
}
