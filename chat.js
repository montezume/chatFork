function init() {
	// set global vars.
	window.lastId = 0;
	getUserId();
		
	if ($.cookie('login') == null) {
		window.location.replace("login.html");
	}
	
	retrieveLastFiveMinutes();
	
	//alert(window.lastId);
	window.setInterval(retrieveMessages, 2000);
	
	// TODO add send functionality.
	
	//$("#messageBox");
	
	//let's get userid....
	
	//$("#messageBox").val('cal');
	$( "#sendButton" ).click(function() { sendMessage(); return false });
 	$( "#logoutButton" ).click(function() { logout(); return false });

}

	function logout() {
	$.ajax({

        type: "POST",
        url: "chater.php",
        data: {
            request_type: 'logout'
        },
        dataType: "html",
        async: true,
        success: function(msg) {
			$.cookie('login', null, { path: '/' })
			alert($.cookie('login'));
			window.location.replace("login.html");
        }
    });
    return;
	
}

		
	
	function getUserId() {
	$.ajax({

        type: "POST",
        url: "chater.php",
        data: {
            request_type: 'retrieveUserId'
        },
        dataType: "html",
        async: true,
        success: function(msg) {
			if (msg) {
				window.userId = parseInt(msg);
            } else {
				//redirect as not logged in.
            }
			
        }
    });
    return;
	
}

	function sendMessage() {
	
	
	var message = $("#messageBox").val();
	if (message == "") {
		return;
	}
	
	$.ajax({

        type: "POST",
        url: "chater.php",
        data: {
            request_type: 'sendMessage',
			content : message,
			user_Id : window.userId
        },
        dataType: "html",
        async: true,
        success: function(msg) {
			if (msg) {
				// message was sent.
            } else {
				alert('message not sent');
            }
			
        }
    });
    return;
	
	
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
			
			window.lastId = jsonReturned[0].msg_id;
			$("#chatTable").append(returnedHtml);
			$("#chatDiv").scrollTop($("#chatDiv")[0].scrollHeight);

		}
		
		else {
			// if no messages were returned, do something. must update last message id.
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
			
			if (jsonReturned.length != 0) {
				window.lastId = jsonReturned[(jsonReturned.length - 1)].msg_id;
			}
			$("#chatTable").append(returnedHtml);
			
			$("#chatDiv").scrollTop($("#chatDiv")[0].scrollHeight);
		}
		
		else {
			// no messages yall
		}
			
        }
    });
    return;
}

window.onload = init;