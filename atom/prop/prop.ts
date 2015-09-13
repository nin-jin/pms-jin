module $jin.atom {
    
    // Base implementation of reactive property 
    export class prop < ValueType , OwnerType extends { objectId : string } > extends $jin.object < OwnerType > {

        static currentSlave : $jin.atom.prop<any,any>

        static pull : any = new $jin.atom.wait( 'pull' )

        static enableLogs = false
        private static _defer : $jin.defer
        private static _updatePlan : $jin.atom.prop<any,any>[][] = []
        private static _reapPlan : { [ id : string ] : $jin.atom.prop<any,any> } = {}

        static swap( atom : $jin.atom.prop<any,any> ) {
            var last = this.currentSlave
            this.currentSlave = atom
            return last
        }

        static induceSchedule(){
            if( !this._defer ){
                this._defer = new $jin.defer( () => this.induce() )
            }
        }

        static updateSchedule( atom : $jin.atom.prop<any,any> ){
            var deep = atom.mastersDeep
            var plan = this._updatePlan
            var queue = plan[ deep ]
            if( !queue ) queue = plan[ deep ] = []
            queue.push( atom )

            this.induceSchedule()
        }

        static reapSchedule( atom : $jin.atom.prop<any,any> ){
            var plan = this._reapPlan[ atom.objectId ] = atom

            this.induceSchedule()
        }

        static induce(){
            var updatePlan = $jin.atom.prop._updatePlan
            for( var deep = 0 ; deep < updatePlan.length ; ++deep ){
                var queue = updatePlan[ deep ]
                if( !queue ) continue
                if( !queue.length ) continue

                var atom = queue.shift()
                if( atom.status === $jin.atom.status.clear ){
                    atom.pull()
                }

                deep = -1
            }

            var reapPlan = $jin.atom.prop._reapPlan
            this._reapPlan = {}

            for( var id in reapPlan ){
                var atom = reapPlan[ id ]
                if( !atom ) continue
                if( atom.slavesCount !== 0 ) continue
                if( !atom.status ) continue
                atom._reap( atom , atom.value )
            }

            this._defer = null
        }

        constructor ( config : {
            owner? : OwnerType
            name? : string
            param? : any

            status? : $jin.atom.status
            value? : ValueType
            error? : Error
            
            get? : ( atom : $jin.atom.prop<ValueType,OwnerType> , value : ValueType ) => ValueType
            pull? : ( atom : $jin.atom.prop<ValueType,OwnerType> , prev : ValueType ) => ValueType
            merge? : ( atom : $jin.atom.prop<ValueType,OwnerType> , next : ValueType , prev : ValueType ) => ValueType
            put? : ( atom : $jin.atom.prop<ValueType,OwnerType> , next : ValueType , prev : ValueType ) => any
            reap? : ( atom : $jin.atom.prop<ValueType,OwnerType> , value : ValueType ) => any
            notify? : ( atom : $jin.atom.prop<ValueType,OwnerType> , next : ValueType , prev : ValueType ) => any
            fail? : ( atom : $jin.atom.prop<ValueType,OwnerType> , error : Error ) => any
        } ) {
            
            if( config.name ) {

                if( config.owner ) {

                    var genericField = config.name
                    var instanceField = genericField
                    if( config.param !== void 0 ) instanceField += '_' + config.param
                    var instanceHost = config.owner

                    var instance = instanceHost[ instanceField ]
                    if( instance ) return instance

                    var genericHost = config.owner['constructor']
                    var klass = genericHost[ genericField ]
                    if( !klass ) klass = genericHost[ genericField ] = (<any>this.constructor).makeClass({
                        name : config.name,
                        _pull : config.pull ,
                        _get : config.get ,
                        _merge : config.merge ,
                        _put : config.put ,
                        _reap : config.reap ,
                        _notify : config.notify ,
                        _fail : config.fail
                    })

                    return new klass({
                        owner : config.owner ,
                        param : config.param ,
                        status : config.status ,
                        value : config.value ,
                        error : config.error
                    })

                } else {
                    this.name = config.name
                }

            }

            if( config.owner ) {
                this.param = config.param

                super({
                    owner : config.owner ,
                    name : this.name && ( this.param !== void 0 ? ( this.name + '_' + this.param ) : this.name )
                })
            } else {
                super({ name : config.name })

                if( config.pull ) this._pull = config.pull
                if( config.get ) this._get = config.get
                if( config.merge ) this._merge = config.merge
                if( config.put ) this._put = config.put
                if( config.reap ) this._reap = config.reap
                if( config.notify ) this._notify = config.notify
                if( config.fail ) this._fail = config.fail
            }

            this.status = config.status || $jin.atom.status.clear
            this.value = config.value
            this.error = config.error

            this.slavesCount = 0
            this.mastersDeep = 0

            return this
        }

        destroy(){
            this.clear()
            this.status = $jin.atom.status.destroyed
            super.destroy()
        }

        name : string
        param : any

        status : $jin.atom.status
        value : ValueType
        error : Error
        
        masters : { [ index : number ] : $jin.atom.prop<any,any> }
        mastersDeep : number

        slaves : { [ index : number ] : $jin.atom.prop<any,any> }
        slavesCount : number

        _get( atom : $jin.atom.prop<ValueType,OwnerType> , value : ValueType ){
            return value
        }

        _pull( atom : $jin.atom.prop<ValueType,OwnerType> , prev : ValueType ){
            return prev
        }

        _merge( atom : $jin.atom.prop<ValueType,OwnerType> , next : ValueType , prev : ValueType ){
            return next
        }

        _put( atom : $jin.atom.prop<ValueType,OwnerType> , next : ValueType , prev : ValueType ){
            this.push( next )
            return this
        }

        _reap( atom : $jin.atom.prop<ValueType,OwnerType> , value : ValueType ){
            this.destroy()
        }

        _notify( atom : $jin.atom.prop<ValueType,OwnerType> , next : ValueType , prev : ValueType ){
        }

        _fail( atom : $jin.atom.prop<ValueType,OwnerType> , error : Error ){
        }

        push( next : ValueType ) : ValueType{
            if( this.status === $jin.atom.status.destroyed ) {
                throw new Error( 'Can not push to destroyed atom' )
            }
            var prev = this.value
            next = this.merge( next , prev )
            this.value = next
            this.status = $jin.atom.status.actual
            if( ( next !== prev ) || this.error ) {
                this.notify( null , next , prev )
            }
            this.error = undefined
            this.status = $jin.atom.status.actual
            return next
        }

        fail( error : Error ) : Error {
            if( this.error !== error ){
                this.error = error
                this.status = $jin.atom.status.error
                this.notify( error , undefined , this.value )
            }
            this.status = $jin.atom.status.error
            return error
        }

        notify( error? : Error , next? : ValueType , prev? : ValueType ){
            if( $jin.atom.prop.enableLogs ) {
                $jin.log( this.objectId )
                if( error ) {
                    $jin.log.error( error )
                } else {
                    $jin.log( error || next )
                }
            }
			var lastCurrent = $jin.atom.prop.swap( null )
			try {
				if (error) {
					this._fail(this, error)
				} else {
					this._notify(this, next, prev)
				}
				if( prev && ( prev['owner'] === this ) && ( typeof prev['destroy'] === 'function' ) ) {
					prev['destroy']()
				}
			} finally {
				$jin.atom.prop.swap( lastCurrent )
			}
			if( this.slavesCount ){
				for( var slaveId in this.slaves ){
					var slave = this.slaves[ slaveId ]
					if( !slave ) continue
			
					slave.update()
			
				}
			}
        }

        update(){
            if( this.status === $jin.atom.status.clear ){
                return
            }

            if( this.error === $jin.atom.prop.pull ){
                return
            }

            if( this.status === $jin.atom.status.destroyed ){
                throw new Error( 'Can not update destroyed atom' )
            }

            $jin.atom.prop.updateSchedule( this )

            this.status = $jin.atom.status.clear
        }

        touch(){
            var slave = $jin.atom.prop.currentSlave
            if( slave ){
                this.lead( slave )
                slave.obey( this )
            } else {
            }
        }

        get() : ValueType{

            this.touch()

            if( this.status === $jin.atom.status.clear ){
                this.pull()
            }

            if( this.status === $jin.atom.status.error ){
                throw this.error
            }

            if( this.status === $jin.atom.status.actual ){
                return this._get( this , this.value )
            }

            throw new Error( 'Wrong status: ' + this.status )
        }

        pull(){
            var lastCurrent = $jin.atom.prop.swap( this )

            var oldMasters = this.masters
            this.masters = null
            this.mastersDeep = 0

            this.status = $jin.atom.status.error
            this.error = $jin.atom.prop.pull

            try {

                var value = this.value
                value = this._pull( this , value )
                this.push( value )

            } catch( error ){

                this.fail( error )

            } finally {

                $jin.atom.prop.swap( lastCurrent )

                if( oldMasters ) for( var masterId in oldMasters ){
                    var master = oldMasters[ masterId ]
                    if( !master ) continue

                    if( this.masters && this.masters[ masterId ] ) continue

                    master.dislead( this )
                }
                
                if( this.status === $jin.atom.status.clear ) debugger
            }
        }

        set( next : ValueType , prev : ValueType = this.value ){
            next = this.merge( next , prev )

            if( next !== prev ){
                return this.put( next , prev )
            }
            
            return this
        }

        put( next : ValueType , prev : ValueType ) {
            return this._put( this , next , prev )
        }

        mutate( mutate : ( prev : ValueType ) => ValueType ) {
            var lastCurrent = $jin.atom.prop.swap( null )
            try {
                this.set( mutate( this.get() ) )
            } finally {
                $jin.atom.prop.swap( lastCurrent )
            }
        }

        merge( next : ValueType , prev : ValueType ) {
            return this._merge( this , next , prev )
        }

        clear(){
            var prev = this.value
            var next = this.value = undefined
            
            this.disobeyAll()
            this.status = $jin.atom.status.clear
            this.notify( null , next , prev )
        }

        reap( ) {
            if( this._pull === $jin.atom.prop.prototype._pull ) return
            $jin.atom.prop.reapSchedule( this )
        }

        lead( slave : $jin.atom.prop<any,any> ){
            var slaveId = slave.objectId

            if( this.slaves ){
                if( this.slaves[ slaveId ] ) return
            } else {
                this.slaves = {}
            }

            this.slaves[ slaveId ] = slave

            this.slavesCount++
        }

        dislead( slave : $jin.atom.prop<any,any> ){
            var slaveId = slave.objectId
            if( !this.slaves[ slaveId ] ) return

            this.slaves[ slaveId ] = null

            if( !--this.slavesCount ){
                this.reap()
            }
        }

        disleadAll(){
            if( !this.slavesCount ) return

            for( var slaveId in this.slaves ){

                var slave = this.slaves[ slaveId ]
                if( !slave ) continue

                slave.disobey( this )
            }

            this.slaves = null
            this.slavesCount = 0

            this.reap()
        }

        obey( master : $jin.atom.prop<any,any> ){
            var masters = this.masters
            if( !masters ) masters = this.masters = {}

            var masterId = master.objectId
            if( masters[ masterId ] ) return
            masters[ masterId ] = master

            var masterDeep = master.mastersDeep
            if( ( this.mastersDeep - masterDeep ) > 0 ) return

            this.mastersDeep = masterDeep + 1
        }

        disobey( master : $jin.atom.prop<any,any> ){
            if( !this.masters ) return
            this.masters[ master.objectId ] = null
        }

        disobeyAll(){
            if( !this.mastersDeep ) return

            for( var masterId in this.masters ){

                var master = this.masters[ masterId ]
                if( !master ) continue

                master.dislead( this )
            }

            this.masters = null
            this.mastersDeep = 0
            this.status = $jin.atom.status.clear
        }

        on(
            done? : ( value : ValueType ) => any ,
            fail? : ( error : Error ) => any
        ) {

            if( !done ) done = value => null
            if( !fail ) fail = error => $jin.log.error( error )

            var listener = new $jin.atom.prop<ValueType,any>( {
                pull : ( promise , prev ) =>{
                    try {
                        return this.get()
                    } catch( error ) {
                        if( error instanceof $jin.atom.wait ) {
                            return
                        } else {
                            throw error
                        }
                    }
                } ,
                notify : ( listener , next ) => {
                    if( next === undefined ) return
                    done( next )
                } ,
                fail : ( listener , error ) => {
                    if( error instanceof $jin.atom.wait ) return
                    fail( error )
                }
            } )

            listener.push( undefined )
            listener.update()

            return listener
        }

        then<ResultType>(
            done? : ( value : ValueType ) => ResultType ,
            fail? : ( error : Error ) => ResultType
            ) {

            if( !done ) done = value => null
            if( !fail ) fail = error => $jin.log.error( error )

            var promise = new $jin.atom.prop<ResultType,any>( {
                pull : ( promise , prev ) =>{
                    try {
                        var next = this.get()
                        if (next === void 0) return prev

                        promise.disobeyAll()

                        return done(next)
                    } catch( error ) {
                        if( error instanceof $jin.atom.wait ) {
                            return
                        } else {
                            throw error
                        }
                    }
                } ,
                fail : ( promise , error ) => {
                    promise.disobeyAll()

                    fail( error )
                }
            } )

            promise.push( undefined )
            promise.update()

            return promise
        }

        catch<ResultType>( fail? : ( error : Error ) => ResultType ){
            return this.then( null , fail )
        }

    }

}
