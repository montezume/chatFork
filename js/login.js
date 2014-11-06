
function init() {
		
		// start by unchecking register box.
		
		$("#registerCheck").change(function() {
            if (this.checked) {
                
				//add event listeners to validate input.
				
                $("#inputPassword").keyup(function() {
                    onKeyUp('checkPass', $("#inputPassword"), $("#passwordDiv"), $("#passIcon") );
                });
				
                $("#inputUsername").keyup(function() {
                    onKeyUp('checkUser', $("#inputUsername"), $("#usernameDiv"), $("#userIcon") );
                });
				
				// display email div.
				$("#emailDiv").attr("class", "form-group");
                return;
            }
			else {
			alert('not checked');
			$("#emailDiv").attr("class", "form-group hide");
			$("#inputPassword").off();
			$("#inputUsername").off();
			}
			return;
        });
		  
	$( "#connectButton" ).click(function() { onConnectClick( $("#inputUsername"), $("#inputPassword"), $("#inputEmail") ); }  );

    } // end init

        
	

function onConnectClick(usernameBox, passwordBox, emailBox) {
	
	alert('test');
	
	if ($('#registerCheck').is(":checked")) {
		onRegister(usernameBox, passwordBox, emailBox);
	}
	
	else {
		onLogin(usernameBox, passwordBox);
	}
	
	
	// either register or connect based on checkbox.
	
}
/*

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

function onKeyUp(requestType, inputBox, div, userIcon) {


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
				userIcon.attr("class", "glyphicon glyphicon-ok form-control-feedback");

            } else {
				div.attr("class", "form-group has-error has-feedback");
				userIcon.attr("class", "glyphicon glyphicon-remove form-control-feedback");

            }
        }
    });

    return;
}

window.onload = init;