function init() {
	window.lastId = 0;
	
	/*
	if (!$.cookie('login')) {
		window.location.replace("login.html");
	}
	*/
	// You are now logged in. You can do all of the fun stuff that logged in people can do.
	// Which is ????
	
	// continuously get messages.
	
	alert(retrieveMessages(0));
	
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
			alert(JSON.parse((msg)));
			
        }
    });
    return;
}

	
}
window.onload = init;