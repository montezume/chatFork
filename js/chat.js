function init() {
    // set global vars.
    window.lastId = -1;
    // Make sure user is authenticated, and grab his user id.
	//getUserId();

    //retrieveLastFiveMinutes();

    //$("#messageBox").val('cal');
	/*
    $("#sendButton").click(function() {
        sendMessage();
        return false
    });
    $("#logoutButton").click(function() {
        logout();
        return false
    });
	*/
	
	alert('test');
}

function logout() {
   alert('logout');
   $.ajax({
        type: "POST",
        url: "ChatController.php",
        data: {
            request_type: 'logout'
        },
        dataType: "html",
        async: true,
        success: function(msg) {
            //$.cookie('login', null, { path: '/' })
            window.location.replace("login.html");
        }
    });
    return;

}

function getUserId() {
    $.ajax({

        type: "POST",
        url: "ChatController.php",
        data: {
            request_type: 'retrieveUserId'
        },
        dataType: "html",
        async: true,
        success: function(msg) {
            if (msg != -1) {
                window.userId = parseInt(msg);
            } else {
				// user is not logged in, so redirect to login.
				window.location.replace("login.html");
			}

        }
    });
    return;

}

function sendMessage() {

    var messageBox = $("#messageBox")
    
	// if message box is blank, don't send message.
	if (messageBox.val() == "") {
        return;
    }
	
    $.ajax({

        type: "POST",
        url: "ChatController.php",
        data: {
            request_type: 'sendMessage',
            content: messageBox.val(),
            user_Id: window.userId
        },
        dataType: "html",
        async: true,
        success: function(msg) {
            if (msg != -1) {
                // Message was successfully sent to the server.
            } else {
                // Message was not sent. 
                // User is probably not authenticated.
				// Redirect to login again.
                window.location.replace("login.html");
            }

        }
    });
	// empty message box.

	messageBox.val("");

    return;
}


function retrieveLastFiveMinutes() {
    $.ajax({

        type: "POST",
        url: "ChatController.php",
        data: {
            'request_type': 'retrieveLastFive',
        },

        async: true,
        success: function(msg) {
	
            if (msg != -1) {
                // if messages are returned, add them to table.
                var jsonReturned = $.parseJSON(msg);
                var returnedHtml = '';
				
				if (jsonReturned.length != 0) {
				
                for (var i = 0; i < jsonReturned.length; i++) {
					returnedHtml += '<tr><td>';
                    returnedHtml += jsonReturned[i].username + '</td> <td>' + jsonReturned[i].content + "</td> <td>" + jsonReturned[i].date + '</td></tr>';
                }

                // grab last message id, and update global variable.
				
                window.lastId = jsonReturned[jsonReturned.length - 1].msg_id;
				}
				
				// else no messages exist in database, so set last message id to 0.
				else {
					window.lastId = 0;
				}
                $("#chatTable").append(returnedHtml);
                $("#chatDiv").scrollTop($("#chatDiv")[0].scrollHeight);
            } else {
				// user is not logged in, so redirect to login.
				window.location.replace("login.html");
            }

        }
    });
	// Add events to continuously check for online users and new messages.
    window.setInterval(retrieveMessages, 2000);
    window.setInterval(getOnlineUsers, 2000);

    return;
}

function getOnlineUsers() {
    $.ajax({

        type: "POST",
        url: "ChatController.php",
        data: {
            'request_type': 'getOnlineUsers',
        },
        async: true,
        success: function(msg) {
            if (msg != -1) {

                // if messages are returned, add them to table.
                var jsonReturned = $.parseJSON(msg);
                var returnedHtml = '<table>';
                //alert(jsonReturned[1].username);

                for (var i = 0; i < jsonReturned.length; i++) {


                    returnedHtml += '<tr><td>' + jsonReturned[i].username + '</td> <td>' +
                        jsonReturned[i].last_active + '</td> <td>';
                    returnedHtml += '</tr>';
                }

                returnedHtml += '</table>';
                $("#users").html(returnedHtml);
            } else {
				// user is not logged in, so redirect to login.
				window.location.replace("login.html");
            }

        }
    });
    return;

}

function retrieveMessages() {

	if (window.lastId == -1) {
		return;
	}

    //alert('last id' + window.lastId);

    $.ajax({

        type: "POST",
        url: "ChatController.php",
        data: {
            'request_type': 'retrieve',
            'last_Id': window.lastId
        },
        async: true,
        success: function(msg) {

            if (msg != -1) {

                // if messages are returned, add them to table.
                var jsonReturned = $.parseJSON(msg);
                var returnedHtml = '';
                //alert(jsonReturned[1].username);

                for (var i = 0; i < jsonReturned.length; i++) {

					returnedHtml += '<tr><td>';
                    returnedHtml += jsonReturned[i].username + '</td> <td>' + jsonReturned[i].content + "</td> <td>" + jsonReturned[i].date + '</td></tr>';
                }
                // grab last message id, and update global variable.

                if (jsonReturned.length != 0) {
                    window.lastId = jsonReturned[(jsonReturned.length - 1)].msg_id;
					$("#chatTable").append(returnedHtml);
					$("#chatDiv").scrollTop($("#chatDiv")[0].scrollHeight);
                }

            } else {
				// user is not logged in, so redirect to login.
				window.location.replace("login.html");
            }

        }
    });
    return;
}

window.onload = init;