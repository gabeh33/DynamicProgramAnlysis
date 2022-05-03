"use strict";

//send({type: 'hello', hello_message: 'hello world'})

// Suggestions to help
var mem_allocations = {}; // Address => size. If you want
var first_allocation = true;

// Sketch of what you might want to do.
// Use interceptor to record entry and exit of malloc and free
// Use local javascript to store state between those.
// There's an easy way to pass state between an Interpreter onEnter
// and OnLeave function you can just use `this.something` store state
// Call send() as appropriate
//send({type: 'heap_info', start:'1', end:'20'})


//Attach to malloc calls?
var recent_val = -1;
Interceptor.attach(Module.getExportByName('','malloc'), {
  onEnter(args) {
    //console.log("MALLOC-ENTER");
    //console.log("size: " + Number(args[0]));
    recent_val = Number(args[0]);
  },
  onLeave(retval) {
    //console.log("MALLOC-LEAVE");
    //console.log("Address: " + retval);

    mem_allocations[retval] = recent_val;

    if (first_allocation) {
    	// Send a heap_info message 
    	var size = Process.getRangeByAddress(retval).size;
    	var base = Process.getRangeByAddress(retval).base;
	
  		//console.log("size:" + size);
  		//console.log("base:" + base);

  		var decimal_start = parseInt(base, 16);
  		decimal_start += size;
  		var ending_location = decimal_start.toString(16);
  		ending_location = "0x" + ending_location;
  		//console.log("ending_location: " + ending_location);
  		
  		first_allocation = false;
  		send({type: 'heap_info', start:parseInt(Process.getRangeByAddress(retval).base), end:parseInt(ending_location)})

  	}
  	//console.log("address:" + retval);
  	//console.log("size:" + mem_allocations[retval]);
    send({type:'allocation', address:parseInt(retval), size:parseInt(mem_allocations[retval])})
  }
});

Interceptor.attach(Module.getExportByName('','free'), {
  onEnter(args) {
    //console.log("FREE-ENTER");
    send({type:'free', address:parseInt(args[0]), 'size':mem_allocations[args[0]]})
  },
  onLeave(retval) {
  

  }
});





