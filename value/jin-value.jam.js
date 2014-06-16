this.$jin.value = function $jin_value( value ){
    
    var func = function $jin_value_instance( ){
        return value
    }
	
	func.valueOf = func
	func.toString = func
    
    func.$jin_value = value
    
    return func
}
