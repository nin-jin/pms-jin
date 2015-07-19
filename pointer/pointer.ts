module $jin {
    export var pointer = {
        mouse : {
            listener : {
                press : new $jin.atom.prop<$jin.dom2.listener,any>({
                    pull : atom => new $jin.dom2.listener({
                        owner : atom,
                        node : document.documentElement,
                        events : [ 'mousedown' , 'mouseup' ],
                        handler : event => {
                            $jin.pointer.mouse.pressed.itemSet( event.button , event.type === 'mousedown' )
                            $jin.pointer.pressed.itemSet( event.button , event.type === 'mousedown' )
                        }
                    })
                }),
                move : new $jin.atom.prop<$jin.dom2.listener,any>({
                    pull : atom => new $jin.dom2.listener({
                        owner : atom,
                        node : document.documentElement,
                        events : [ 'mousemove' ],
                        handler : event => {
                            var pos = [ event.clientX , event.clientY ]
                            $jin.pointer.mouse.position.push( pos )
                            $jin.pointer.position.push( pos )
                        }
                    })
                }),
                point : new $jin.atom.prop<$jin.dom2.listener,any>({
                    pull : atom => new $jin.dom2.listener({
                        owner : atom,
                        node : document.documentElement,
                        events : [ 'mouseenter' , 'mouseover' ],
                        handler : event => {
                            $jin.pointer.mouse.target.push( event.target )
                            $jin.pointer.target.push( event.target )
                        }
                    })
                })
            },
            pressed : new $jin.atom.map<boolean,any>({
                pull : atom => {
                    $jin.pointer.mouse.listener.press.get()
                    return {}
                }
            }),
            position : new $jin.atom.list<number[],any>({
                pull : ( atom , prev ) => {
                    $jin.pointer.mouse.listener.move.get()
                    return prev || []
                }
            }),
            target : new $jin.atom.prop<HTMLElement,any>({
                pull : ( atom , prev ) => {
                    $jin.pointer.mouse.listener.point.get()
                    return prev || null
                }
            })
        },
        pressed : new $jin.atom.map<boolean,any>({
            pull : atom => {
                return $jin.pointer.mouse.pressed.get()
            }
        }),
        position : new $jin.atom.list<number[],any>({
            pull : ( atom , prev ) => {
                return $jin.pointer.mouse.position.get()
            }
        }),
        target : new $jin.atom.prop<HTMLElement,any>({
            pull : ( atom , prev ) => {
                return $jin.pointer.mouse.target.get()
            }
        })
    }
}
