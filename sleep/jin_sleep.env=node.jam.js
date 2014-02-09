$jin.sleep = $jin.async2sync( function $jin_sleep( delay, done ){
    setTimeout( done, delay )
} )
