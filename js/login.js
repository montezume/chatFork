
function init() {
		
		$("#registerCheck").change(function() {
			
		
            if (this.checked) {
                //add event listeners to validate input.
				/*
                passwordBox.on("focusin", function() {
                    onFocusIn('passAlert');
                });
				*/
				/*
                passwordBox.on("focusout", function() {
                    onFocusOut('checkPass', $("#passwordBox"), '.passAlert')
                });
				/*
                $("#inputUsername").on("focusin", function() {
                    onFocusIn('userAlert');
                });
				
				*/
                $("#inputUsername").on("focusout", function() {
                    onFocusOut('checkUser', $("#inputUsername"), $("#usernameDiv"), $("#usernameFeedback") );
                });
				/*
                $("#loginTable").append(emailHtml);
				emailBox = $("#emailBox");
                $.cookie('registerCheck', '1');
                return;
				*/
            }
			
			/*
            $(" #emailRow ").remove();
            passwordBox.off();
            usernameBox.off();
			$.cookie('registerCheck', '0');
			onFocusIn('.userAlert');
            onFocusIn('.passAlert');
			return;
			*/
        });
		
		
		/*
        var usernameBox = $("#username");
        var passwordBox = $("#passwordBox");
        var emailHtml = "<tr id='emailRow'> <th>Email</th> <td><input type=text id='emailBox'> </td> <td><span class=emailAlert></span></td></tr>";
		var emailBox;
		*/
  
	//$( "#connectButton" ).click(function() { onConnectClick(usernameBox, passwordBox, emailBox); }  );

    } // end init

        
		/*

function onConnectClick(usernameBox, passwordBox, emailBox) {
	
	if ($('#registerCheck').is(":checked")) {
		onRegister(usernameBox, passwordBox, emailBox);
	}
	
	else {
		onLogin(usernameBox, passwordBox);
	}
	
	
	// either register or connect based on checkbox.
	
}

function onLogin(usernameBox, passwordBox) {
	$('.registerAlert').html('');

	$.ajax({

        type: "POST",
        url: "ChatController.php",
        data: {
            request_type: 'login',
            name: usernameBox.val(),
			password: passwordBox.val(),
        },
        dataType: "html",
        async: true,
        success: function(msg) {
			if (msg != -1) {
				window.location.href = 'index.html';

            } else {
				$('.registerAlert').html('Invalid username or password').css('color', 'red');

            }
			
        }
    });
    return;
}

function onRegister(usernameBox, passwordBox, emailBox) {
	
	$('.registerAlert').html('');

	// user and pass are valid apparently, let's register yall
	    $.ajax({

        type: "POST",
        url: "ChatController.php",
        data: {
            request_type: 'register',
            name: usernameBox.val(),
			password: passwordBox.val(),
			email: emailBox.val()
        },
        dataType: "html",
        async: true,
        success: function(msg) {
            if (msg) {
				$.cookie('login', msg);				
				window.location.replace("index.html");

            } else {
				$('.registerAlert').html('Register failed... try again?').css('color', 'red');
            }
        }
    });

    return;

	
}
	
function onFocusIn(alertBox) {
    $(alertBox).html('');
}

*/

function onFocusOut(requestType, inputBox, div, feedbackDiv) {


    $.ajax({

        type: "POST",
        url: "/ChatFork/ChatController.php",
        data: {
            request_type: requestType,
            name: inputBox.val()
        },
        dataType: "html",
        async: true,
        success: function(msg) {
			//alert(msg);
            if (parseInt(msg) != -1) {
				div.attr("class", "form-group has-success has-feedback");
				feedbackDiv.append("<span style='padding-right:20px' class='glyphicon glyphicon-ok form-control-feedback'></span>");


            } else {
				div.attr("class", "form-group has-error has-feedback");
				feedbackDiv.remove();
				//div.attr("class", "form-group has-success");
            }
        }
    });

    return;
}

window.onload = init;