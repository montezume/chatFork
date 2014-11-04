function init() {
    // set global vars.
    window.lastId = -1;
    // Make sure user is authenticated, and grab his user id.
	getUserId();

    /*
	if ($.cookie('login') == null) {
		window.location.replace("login.html");
	}
	*/
    retrieveLastFiveMinutes();


    // TODO add send functionality.

    //$("#messageBox");

    //let's get userid....

    //$("#messageBox").val('cal');
    $("#sendButton").click(function() {
        sendMessage();
        return false
    });
    $("#logoutButton").click(function() {
        logout();
        return false
    });
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
			alert(msg);
            if (msg != -1) {
                window.userId = parseInt(msg);
            } else {
				//window.location.replace("\login.html");

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
        url: "ChatController.php",
        data: {
            request_type: 'sendMessage',
            content: message,
            user_Id: window.userId
        },
        dataType: "html",
        async: true,
        success: function(msg) {
            if (msg != -1) {
                // message was sent.
                alert('test');
            } else {
                // Message was not sent. 
                // User is probably not authenticated.
                window.location.replace("login.html");
            }

        }
    });
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
                //alert(jsonReturned[1].username);

                for (var i = 0; i < jsonReturned.length; i++) {
                    if (jsonReturned[i].user_id = window.userId) {
                        alert('inif');
                        returnedHtml += "<tr><td style='color:red;'>";
                    } else {
                        returnHtml += '<tr><td>'
                    }

                    returnedHtml += jsonReturned[i].username + '</td> <td>' +
                        jsonReturned[i].content + "</td> <td>" + jsonReturned[i].date + '</td>';
                    returnedHtml += '</tr>';
                }

                // grab last message id, and update global variable.

                window.lastId = jsonReturned[jsonReturned.length - 1].msg_id;
                $("#chatTable").append(returnedHtml);
                $("#chatDiv").scrollTop($("#chatDiv")[0].scrollHeight);
            } else {
                // if no messages were returned, do something. must update last message id.

            }

        }
    });

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
            if (msg) {

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
                // no messages yall
            }

        }
    });
    return;

}

function retrieveMessages() {
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

            if (msg) {


                // if messages are returned, add them to table.
                var jsonReturned = $.parseJSON(msg);
                var returnedHtml = '';
                //alert(jsonReturned[1].username);

                for (var i = 0; i < jsonReturned.length; i++) {

                    if (jsonReturned[i].user_id = window.userId) {
                        returnedHtml += "<tr><td style='color:red;'>";
                    } else {
                        returnHtml += '<tr><td>'
                    }

                    returnedHtml += jsonReturned[i].username + '</td> <td>' +
                        jsonReturned[i].content + '</td> <td>' + jsonReturned[i].date + '</td>';
                    returnedHtml += '</tr>';
                }
                // grab last message id, and update global variable.

                if (jsonReturned.length != 0) {
                    window.lastId = jsonReturned[(jsonReturned.length - 1)].msg_id;
                }

                $("#chatTable").append(returnedHtml);

                $("#chatDiv").scrollTop($("#chatDiv")[0].scrollHeight);
            } else {
                // no messages yall
            }

        }
    });
    return;
}

window.onload = init;