module $jin.atom {

    // Base implementation of reactive property 
    export class prop<ValueType,OwnerType extends $jin.object> extends $jin.object {
        
        static currentMaster : $jin.atom.prop

        private static _defer : $jin.defer
        private static _updatePlan : $jin.atom.prop<any,any>[][] = []
        private static _reapPlan : { [ id : string ] : $jin.atom.prop<any,any> } = {}

        static swap( atom : $jin.atom.prop<any,any> ) {
            var last = this.currentMaster
            this.currentMaster = atom
            return last
        }

        static induceSchedule(){
            if( !this._defer ){
                this._defer = new $jin.defer( () => this.induce() )
            }
        }

        static updateSchedule( atom : $jin.atom.prop<any,any> ){
            var deep = atom.mastersDeep()
            var plan = this._updatePlan
            var queue = plan[ deep ]
            if( !queue ) queue = plan[ deep ] = []
            queue.push( atom )

            this.induceSchedule()
        }

        static reapSchedule( atom : $jin.atom.prop<any,any> ){
            var plan = this._reapPlan[ atom.objectPath ] = atom

            this.induceSchedule()
        }

        static induce(){

            var updatePlan = $jin.atom.prop._updatePlan
            for( var deep = 0 ; deep < updatePlan.length ; ++deep ){
                var queue = updatePlan[ deep ]
                if( !queue ) continue
                if( !queue.length ) continue

                var atom = queue.shift()
                if( atom.status() === $jin.atom.status.clear ){
                    atom.pull()
                }

                deep = -1
            }
            
            var reapPlan = $jin.atom.prop._reapPlan
            this._reapPlan = {}
            
            for( var id in reapPlan ){
                var atom = reapPlan[ id ]
                if( !atom ) continue
                if( atom.slavesCount() !== 0 ) continue
                atom._reap()
            }

            this._defer = null
        }

        constructor( config : {
            owner? : OwnerType
            name? : string
            value?: ValueType
            get? : ( value : ValueType ) => ValueType
            pull? : ( prev : ValueType ) => ValueType
            merge? : ( next : ValueType , prev : ValueType ) => ValueType
            put? : ( next : ValueType , prev : ValueType ) => any
            reap? : () => any
            notify? : ( next : ValueType , prev : ValueType ) => any
            fail? : ( error : Error ) => any
        }){
            super( config.name )
            
            this._value = config.value
        
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
        }

        destroy(){
            this.clear()
            super.destroy()
        }

        private _status = $jin.atom.status.clear

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

        private _masters : { [ id : string ] : $jin.atom.prop<any,any> } = {}
        private _mastersDeep = 0

        mastersDeep(){
            return this._mastersDeep
        }

        private _slaves : { [ id : string ] : $jin.atom.prop<any,any> }
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
            next = this.merge( next , prev )
            this._status = $jin.atom.status.actual
            this._value = next
            if( ( next !== prev ) || this._error ){
                this.notify( null , next , prev )
            }
            this._error = undefined
            return next
        }

        fail( error : Error ) : Error{
            this._status = $jin.atom.status.error
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
            if( this._status === $jin.atom.status.clear ){
                return
            }

            if( this._status === $jin.atom.status.pull ){
                return
            }

            this._status = $jin.atom.status.clear
            
            $jin.atom.prop.updateSchedule( this )
        }

        touch(){
            var slave = $jin.atom.prop.currentMaster
            if( slave ){
                this.lead( slave )
                slave.obey( this )
            } else {
                this.reap()
            }
        }

        get() : ValueType{
            if( this._status === $jin.atom.status.pull ){
                throw new Error( 'Cyclic dependency of atom:' + this.objectPath )
            }

            this.touch()

            if( this._status === $jin.atom.status.clear ){
                this.pull()
            }

            if( this._status === $jin.atom.status.error ){
                throw this._error
            }

            if( this._status === $jin.atom.status.actual ){
                return this._get( this._value )
            }

            throw new Error( 'Unknown status ' + this._status )
        }

        pull(){
            var lastCurrent = $jin.atom.prop.swap( this )

            var oldMasters = this._masters
            this._masters = {}

            this._status = $jin.atom.status.pull

            try {

                var value = this._value
                value = this._pull( value )
                this.push( value )

            } catch( error ){

                this.fail( error )

            } finally {

                $jin.atom.prop.swap( lastCurrent )

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

            next = this.merge( next , prev )

            if( next !== prev ){
                this.put( next )
            }
        }

        put( next : ValueType ) {
            return this._put( next , this._value )
        }

        mutate( mutate : ( prev : ValueType ) => ValueType ) {
            this.set( mutate( this.get() ) )
        }
        
        merge( next : ValueType , prev : ValueType ) {
            return this._merge( next , prev )
        }

        clear(){
            var prev = this._value
            var next = this._value = undefined

            this.disobeyAll()
            this._status = $jin.atom.status.clear
            this.notify( null , next , prev )
        }

        reap( ) {
            $jin.atom.prop.reapSchedule( this )
        }

        lead( slave : $jin.atom.prop<any,any> ){
            var slaveId = slave.objectPath
            
            if( this._slaves ){
                if( this._slaves[ slaveId ] ) return
            } else {
                this._slaves = {}
            }

            this._slaves[ slaveId ] = slave

            this._slavesCount++
        }

        dislead( slave : $jin.atom.prop<any,any> ){
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

        obey( master : $jin.atom.prop<any,any> ){
            if( this._masters[ master.objectPath ] ) return
            this._masters[ master.objectPath ] = master

            var masterDeep = master.mastersDeep()
            if( ( this._mastersDeep - masterDeep ) > 0 ) return

            this._mastersDeep = masterDeep + 1
        }

        disobey( master : $jin.atom.prop<any,any> ){
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
            this._status = $jin.atom.status.clear
        }

        then<ResultType>(
            done? : ( value : ValueType ) => ResultType ,
            fail? : ( error : Error ) => ResultType 
        ) : $jin.atom.prop<ResultType,any> {

            if( !done ) done = value => value
            if( !fail ) fail = error => error

            var promise = new $jin.atom.prop<ResultType>( {
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
