window.validPass = false;
window.validUser = false;

function init() {
		
		// start by unchecking register box.
		$("#registerCheck").click(function() {
            if (this.checked) {
                onKeyUp('checkPass', $("#inputPassword"), $("#passwordDiv"), $("#passIcon") );
				onKeyUp('checkUser', $("#inputUsername"), $("#usernameDiv"), $("#userIcon") );
				//add event listeners to validate input.
				
                $("#inputPassword").keyup(function() {
                    onKeyUp('checkPass', $("#inputPassword"), $("#passwordDiv"), $("#passIcon") );
                });
				
                $("#inputUsername").keyup(function() {
                    onKeyUp('checkUser', $("#inputUsername"), $("#usernameDiv"), $("#userIcon") );
                });
				
				// display email div.
				$("#emailDiv").attr("class", "form-group");
				// button should display Register.
				$("#buttonText").text("Register");
				// don't display login error.
				$('#errorDiv').attr("class", "form-group hide");

                return;
            }
			else {
			// remove validation for both fields.

			removeValidation( $("#inputUsername") , $("#usernameDiv"), $("#userIcon") );
			removeValidation( $("#inputPassword") , $("#passwordDiv"), $("#passIcon") );
	
			$("#emailDiv").attr("class", "form-group hide");
			$("#inputPassword").off();
			$("#inputUsername").off();
			// change button text to Login.
			$("#buttonText").text("Login");
			
			}
			return;
        });
		
		
		  $( "#connectButton" ).click(function(e) { onConnectClick( $("#inputUsername"), $("#inputPassword"), $("#inputEmail") );  }  );

    } // end init

        
	

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
				$('#errorDiv').attr("class", "form group");
				//$('.registerAlert').html('Invalid username or password').css('color', 'red');
            }
			
        }
    });
    return;
}

function onRegister(usernameBox, passwordBox, emailBox) {
		
		// insure user name / pass are valid.

		if (!window.validPass || !window.validUser) {
			return;
		}
		
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
				//$.cookie('login', msg);				
				alert('success');
				window.location.replace("index.html");

            } else {
			
				alert('failed');
            }
        }
    });

    return;
}


	
function removeValidation(inputBox, div, userIcon) {
	div.attr("class", "form group");
	userIcon.attr("class", "glyphicon glyphicon-none form-control-feedback");
	
}



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
			
				// success.
				
				(requestType === 'checkPass') ? window.validPass = true : window.validUser = true;
			
				div.attr("class", "form-group has-success has-feedback");
				userIcon.attr("class", "glyphicon glyphicon-ok form-control-feedback");

            } else {
			
				(requestType === 'checkPass') ? window.validPass = false : window.validUser = false;
				div.attr("class", "form-group has-error has-feedback");
				userIcon.attr("class", "glyphicon glyphicon-remove form-control-feedback");

            }
        }
    });

    return;
}

window.onload = init;