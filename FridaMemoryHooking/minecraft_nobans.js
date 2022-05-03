Java.perform(function() {
    var strBuilder = Java.use('java.lang.StringBuilder');
    strBuilder.toString.implementation = function() {
        var response = strBuilder.toString.overload().call(this);
        if (response.includes("frida")) {
                console.log("This is likely an attempt to ban the player \'frida\', ignoring");
                return "Don't try to ban player frida!";
        }
        return response;
    };
})
