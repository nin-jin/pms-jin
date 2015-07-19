//module $jin.object.test {

$jin.test({ 'auto_generated_id' : test =>{
    var one = new $jin.object({ })
    var two = new $jin.object({ })
    test.unique( one.objectId , two.objectId )
}})

$jin.test({ 'id_generation_from_names' : test =>{
    var one = new $jin.object({
        name : 'test1'
    })
    var two = new $jin.object({
        owner : one,
        name : 'test2'
    })
    test.equal( two.objectId , '$jin.object.test1.test2' )
}})

$jin.test({ 'double_destroying' : test =>{
    var one = new $jin.object({ })
    one.destroy()
    one.destroy()
}})

$jin.test({ 'cascade_destroying' : test =>{
    var one = new $jin.object({
        name : 'test1'
    })
    var two = new $jin.object({
        owner : one,
        name : 'test2'
    })
    var three = new $jin.object({
        owner : two,
        name : 'test3'
    })
    test.equal( three.owner , two )
    one.destroy()
    test.equal( three.owner , null )
}})

//}