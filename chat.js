function init() {
	window.lastId = 0;
	
	if (!$.cookie('login')) {
		window.location.replace("login.html");
	}
	
	// You are now logged in. You can do all of the fun stuff that logged in people can do.
	// Which is ????
	
	// continuously get messages.
	
	retrieveMessages(0);
	
	function retrieveMessages(lastId) {
	
	$.ajax({

        type: "POST",
        url: "chater.php",
        data: {
            request_type: 'retrieve',
			last_Id : lastId
        },
        dataType: 'json',
        async: true,
        success: function(msg) {
		//$("#chatTable").append(msg);
			for (var i in msg) {
				for (var j in i) {
				alert(msg[i]);
				}
			}
		
			if (parseInt(msg) == 1) {
				alert('You are logged in');
				$.cookie('login', usernameBox.val());
				window.location.replace("index.html");

            } else {
				//alert('Incorrect username or password');
				//
            }
        }
    });
    return;
}

	
}
window.onload = init;