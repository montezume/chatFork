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
	
	retrieveMessages(0);
}

	function retrieveMessages(lastId) {
	
	$.ajax({

        type: "POST",
        url: "chater.php",
        data: {
            'request_type': 'retrieve',
			'last_Id' : lastId
        },
        async: true,
        success: function(msg) {
		
		if (msg) {
		

			// if messages are returned, add them to table.
			var jsonReturned = $.parseJSON(msg);
			var returnedHtml = '';
			//alert(jsonReturned[1].username);
			
			for (var i = 0; i < jsonReturned.length; i++) {
				returnedHtml += '<tr><td>' + jsonReturned[i].username + '</td> <td>' + 
					jsonReturned[i].content + '</td> <td>' + jsonReturned[i].date + '</td>';
				returnedHtml += '</tr>';			
			}
			
			$("#chatTable").append(returnedHtml);

		}
		
		else {
			// no messages yall
		}
			
        }
    });
    return;
}

window.onload = init;