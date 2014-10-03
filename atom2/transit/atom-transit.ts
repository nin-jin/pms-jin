module $jin.atom2 {

    export class transit<ValueType,OwnerType extends $jin.object> extends $jin.object {

        static current : $jin.atom2.transit

        private static _defer : $jin.defer
        private static _updatePlan : $jin.atom2.transit<any,any>[][] = []
        private static _reapPlan : { [ id : string ] : $jin.atom2.transit<any,any> } = {}

        static induceSchedule(){
            if( !this._defer ){
                this._defer = new $jin.defer( () => this.induce() )
            }
        }

        static updateSchedule( atom : $jin.atom2.transit<any,any> ){
            var deep = atom.mastersDeep()
            var plan = this._updatePlan
            var queue = plan[ deep ]
            if( !queue ) queue = plan[ deep ] = []
            queue.push( atom )

            this.induceSchedule()
        }

        static reapSchedule( atom : $jin.atom2.transit<any,any> ){
            var plan = this._reapPlan[ atom.objectPath ] = atom

            this.induceSchedule()
        }

        static induce(){

            var updatePlan = this._updatePlan
            for( var deep = 0 ; deep < updatePlan.length ; ++deep ){
                var queue = updatePlan[ deep ]
                if( !queue ) continue
                if( !queue.length ) continue

                var atom = queue.shift()
                if( atom.status() === $jin.atom2.status.clear ){
                    atom.pull()
                }

                deep = -1
            }
            
            var reapPlan = this._reapPlan
            this._reapPlan = {}
            
            for( var id in reapPlan ){
                var atom = this._reapPlan[ id ]
                if( !atom ) continue
                if( atom.slavesCount() !== 0 ) continue
                atom._reap()
            }

            this._defer = null
        }

        constructor( config : {
            owner? : OwnerType
            name? : string
            get? : ( value : ValueType ) => ValueType
            pull? : ( prev : ValueType ) => ValueType
            merge? : ( next : ValueType , prev : ValueType ) => ValueType
            put? : ( next : ValueType , prev : ValueType ) => any
            reap? : () => any
            notify? : ( next : ValueType , prev : ValueType ) => any
            fail? : ( error : Error ) => any
        } ){
            super( config.name )

            var field = config.name

            var owner = config.owner
            if( owner ){
                var prop = owner[ field ]
                if( prop ) return prop
                this.owner = owner
            }

            if( config.pull ) this._pull = config.pull
            if( config.get ) this._get = config.get
            if( config.merge ) this._merge = config.merge
            if( config.put ) this._put = config.put
            if( config.reap ) this._reap = config.reap
            if( config.notify ) this._notify = config.notify
            if( config.fail ) this._fail = config.fail

            return this
        }

        destroy(){
            this.clear()
            super.destroy()
        }

        private _status = $jin.atom2.status.clear

        status(){
            return this._status
        }

        private _value : ValueType

        value(){
            return this._value
        }

        private _error : Error

        error(){
            return this._error
        }

        private _masters : { [ id : string ] : $jin.atom2.transit<any,any> } = {}
        private _mastersDeep = 0

        mastersDeep(){
            return this._mastersDeep
        }

        private _slaves : { [ id : string ] : $jin.atom2.transit<any,any> }
        private _slavesCount = 0

        slavesCount(){
            return this._slavesCount
        }

        _get( value : ValueType ){
            return value
        }

        _pull( prev : ValueType ){
            return prev
        }

        _merge( next : ValueType , prev : ValueType ){
            return next
        }

        _put( next : ValueType , prev : ValueType ){
            this.push( next )
        }

        _reap(){
            this.destroy()
        }

        _notify( next : ValueType , prev : ValueType ){
        }

        _fail( error : Error ){
        }

        push( next : ValueType ) : ValueType{
            var prev = this._value
            next = this._merge( next , prev )
            this._status = $jin.atom2.status.actual
            this._value = next
            if( ( next !== prev ) || this._error ){
                this.notify( null , next , prev )
            }
            this._error = undefined
            return next
        }

        fail( error : Error ) : Error{
            this._status = $jin.atom2.status.error
            if( this._error !== error ){
                this._error = error
                this.notify( error , undefined , this._value )
                this._value = undefined
            }
            return error
        }

        notify( error? : Error , next? : ValueType , prev? : ValueType ){
            if( this._slavesCount ){
                for( var slaveId in this._slaves ){
                    var slave = this._slaves[ slaveId ]
                    if( !slave ) continue

                    slave.update()
                }
            }
            if( error ){
                this._fail( error )
            } else {
                this._notify( next , prev )
            }
        }

        update(){
            if( this._status === $jin.atom2.status.clear ){
                return
            }

            if( this._status === $jin.atom2.status.pull ){
                return
            }

            this._status = $jin.atom2.status.clear

            $jin.atom2.transit.updateSchedule( this )
        }

        touch(){
            var slave = $jin.atom2.transit.current
            if( slave ){
                this.lead( slave )
                slave.obey( this )
            } else {
                this.reap()
            }
        }

        get() : ValueType{
            if( this._status === $jin.atom2.status.pull ){
                throw new Error( 'Cyclic dependency of atom:' + this.objectPath )
            }

            this.touch()

            if( this._status === $jin.atom2.status.clear ){
                this.pull()
            }

            if( this._status === $jin.atom2.status.error ){
                throw this._error
            }

            if( this._status === $jin.atom2.status.actual ){
                return this._get( this._value )
            }

            throw new Error( 'Unknown status ' + this._status )
        }

        pull(){
            var lastCurrent = $jin.atom2.transit.current
            $jin.atom2.transit.current = this

            var oldMasters = this._masters
            this._masters = {}

            this._status = $jin.atom2.status.pull

            try {

                var value = this._value
                value = this._pull( value )
                this.push( value )

            } catch( error ){

                this.fail( error )

            } finally {

                $jin.atom2.transit.current = lastCurrent

                for( var masterId in oldMasters ){
                    var master = oldMasters[ masterId ]
                    if( !master ) continue

                    if( this._masters[ masterId ] ) continue

                    master.dislead( this )
                }
            }
        }

        set( next : ValueType ){
            var prev = this._value

            next = this._merge( next , prev )

            if( next !== prev ){
                this._put( next , prev )
            }
        }

        clear(){
            var prev = this._value
            var next = this._value = undefined

            this.disobeyAll()
            this._status = $jin.atom2.status.clear
            this.notify( null , next , prev )
        }

        reap( ) {
            $jin.atom2.transit.reapSchedule( this )
        }

        lead( slave : $jin.atom2.transit<any,any> ){
            var slaveId = slave.objectPath
            
            if( this._slaves ){
                if( this._slaves[ slaveId ] ) return
            } else {
                this._slaves = {}
            }

            this._slaves[ slaveId ] = slave

            this._slavesCount++
        }

        dislead( slave : $jin.atom2.transit<any,any> ){
            var slaveId = slave.objectPath
            if( !this._slaves[ slaveId ] ) return

            this._slaves[ slaveId ] = null

            if( !--this._slavesCount ){
                this.reap()
            }
        }

        disleadAll(){
            if( !this._slavesCount ) return

            for( var slaveId in this._slaves ){

                var slave = this._slaves[ slaveId ]
                if( !slave ) continue

                slave.disobey( this )
            }

            this._slaves = null
            this._slavesCount = 0

            this.reap()
        }

        obey( master : $jin.atom2.transit<any,any> ){
            if( this._masters[ master.objectPath ] ) return
            this._masters[ master.objectPath ] = master

            var masterDeep = master.mastersDeep()
            if( ( this._mastersDeep - masterDeep ) > 0 ) return

            this._mastersDeep = masterDeep + 1
        }

        disobey( master : $jin.atom2.transit<any,any> ){
            this._masters[ master.objectPath ] = null
        }

        disobeyAll(){
            if( !this._mastersDeep ) return

            for( var masterId in this._masters ){

                var master = this._masters[ masterId ]
                if( !master ) continue

                master.dislead( this )
            }

            this._masters = {}
            this._mastersDeep = 0
        }

        then<ResultType>( done? : ( value : ValueType ) => ResultType ,
                          fail? : ( error : Error ) => ResultType ) : $jin.atom2.transit<ResultType,any>{

            if( !done ) done = value => value
            if( !fail ) fail = error => error

            var promise = new $jin.atom2.transit<ResultType>( {
                pull : prev =>{
                    var next = this.get()
                    if( next === prev ) return prev

                    promise.disobeyAll()

                    return done( next )
                } ,
                fail : function( error ){
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