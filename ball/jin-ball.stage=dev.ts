module $jin.ball.test {

    var input = $jin.ball.parse(
        "# sample program\n" +
        "title < string =qwerty\n" +
        "false < bool =false\n" +
        "disabled-val < false\n" +
        "input\n" +
        "\t@ value concat\n" +
        "\t\tstring =title\n" +
        "\t\tstring =123456\n" +
        "\t@ disabled disabled-val\n"
    );

    console.log( input.rows().toString() );
    console.log( $jin.ball.baseContext.rows().toString() );
    console.log( input.execute( $jin.ball.baseContext ).rows().toString() );

}
