function init() {
    // set global vars.
    window.lastId = -1;
	
    // Make sure user is authenticated, and grab his user id.
	
	getUserId();

	
    $("#sendButton").click(function() {
        sendMessage();
        return false
    });
	
	
    $("#logoutButton").click(function() {
        logout();
        return false
    });

	//alert('test');
}

function logout() {
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
				retrieveLastFiveMinutes();

            } else {
				// user is not logged in, so redirect to login.
				window.location.replace("login.html");
			}

        }
    });
    return;

}

function sendMessage() {

    var inputMessage = $("#inputMessage")
    window.clearInterval(retrieveMessages);
	// if message box is blank, don't send message.
	if (inputMessage.val().trim() == "") {
		inputMessage.val("");
        return;
    }
	
    $.ajax({

        type: "POST",
        url: "ChatController.php",
        data: {
            request_type: 'sendMessage',
            content: inputMessage.val(),
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
	window.setInterval(retrieveMessages, 1000);
	inputMessage.val("");

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
                insertMessages(jsonReturned, true);		
				
			} else {
				// user is not logged in, so redirect to login.
				//window.location.replace("login.html");
            }

        }
    });
	// Add events to continuously check for online users and new messages.
    window.setInterval(retrieveMessages, 1000);
    window.setInterval(getOnlineUsers, 1000);
    return;
}

function insertMessages(jsonReturned, firstTime) {
				var htmlMessages = '';
				
				if (jsonReturned.length != 0) {
				
                for (var i = 0; i < jsonReturned.length; i++) {
					
					var messageBody = '';
					(jsonReturned[i].user_id == window.userId) ? messageBody = "<li class='list-group-item list-group-item-success'>" : messageBody = "<li class='list-group-item list-group-item-warning'>";
					
					var userHtml = "<div class='heading'><strong class='primary-font'>" + jsonReturned[i].username + "</strong>";
					
					var timeHtml = "<small class='pull-right text-muted'>" + 
                                    "<span class='glyphicon glyphicon-time'></span> " + jsonReturned[i].date + '</small>';
					var messageHtml = "<p>" + jsonReturned[i].content + "</p>";
					
					/*
					
					else {
					var timeHtml = "<small class='text-muted'>" + 
                                   "<span class='glyphicon glyphicon-time'></span> " + jsonReturned[i].date + ' minutes ago</small>';

					var userHtml = "<div class='heading'><strong class='pull-right primary-font'>" + jsonReturned[i].username + "</strong>";
					
					var messageHtml = "<p>" + jsonReturned[i].content + "</p>";
					}
					*/
					messageBody += userHtml;
					messageBody += timeHtml;
					messageBody += messageHtml;
					messageBody += "</div></li>";
					htmlMessages += messageBody;
				}
				// grab last message id, and update global variable.
				
                window.lastId = jsonReturned[jsonReturned.length - 1].msg_id;
				$("#chatList").append(htmlMessages);
                $("#messageScrollable").scrollTop($("#messageScrollable")[0].scrollHeight);

				// else no messages exist in database, so set last message id to 0.
				}
				
				else {
					if (firstTime) {
					window.lastId = 0;
					}
				}
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
				//alert(msg);
                // if messages are returned, add them to table.
                var jsonReturned = $.parseJSON(msg);
                var returnedHtml = '';
                //alert(jsonReturned[1].username);

                for (var i = 0; i < jsonReturned.length; i++) {
                   returnedHtml += "<li class='list-group-item'>" + jsonReturned[i].username + "<small class='pull-right text-muted'>" + 
                                    "<span class='glyphicon glyphicon-time'></span> " + jsonReturned[i].last_active + " minutes ago</small></li>";

				   
				   
				   
				   //returnedHtml += "<li class='list-group-item'>" + jsonReturned[i].last_active + "</li>";
				   
				   /*
					returnedHtml += "<li class='media'><div class='media-body'><div class='media'><h5>" + jsonReturned[i].username +
					'</h5>' + "<small class='text-muted'>Active as of " + jsonReturned[i].last_active +  '</small></div></div></li>';
                    returnedHtml += '';
					
					*/
                }
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
                insertMessages(jsonReturned);		

            } else {
				// user is not logged in, so redirect to login.
				window.location.replace("login.html");
            }

        }
    });
    return;
}

window.onload = init;