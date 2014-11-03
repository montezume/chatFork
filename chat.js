function init() {
	window.lastId = 0;
		
	/*
	if (!$.cookie('login')) {
		window.location.replace("login.html");
	}
	*/
	
	// You are now logged in. You can do all of the fun stuff that logged in people can do.
	// Which is ????
		
	retrieveLastFiveMinutes();
	
	//alert(window.lastId);
	window.setInterval(retrieveMessages, 100);
}

	function retrieveLastFiveMinutes() {
		$.ajax({

        type: "POST",
        url: "chater.php",
        data: {
            'request_type': 'retrieveLastFive',
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
			
			// grab last message id, and update global variable.
			
			window.lastId = jsonReturned[(jsonReturned.length - 1)].msg_id;
			$("#chatTable").append(returnedHtml);
		}
		
		else {
			// if no messages were returned, do something.
		}
			
        }
    });
    return;
}


	function retrieveMessages() {
	
	$.ajax({

        type: "POST",
        url: "chater.php",
        data: {
            'request_type': 'retrieve',
			'last_Id' : window.lastId
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
			// grab last message id, and update global variable.
			
			window.lastId = jsonReturned[(jsonReturned.length - 1)].msg_id;

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