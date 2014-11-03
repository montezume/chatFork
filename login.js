
function init() {
		window.validUser = false; // global var for username validation.
		window.validPass = false; // global var for pass validation

		// check to see if user is logged in, if so redirect.
		/*
		if ($.cookie('login')) {
			window.location.replace("index.html");
		}
		*/
		
		$("#registerCheck").change(function() {
            if (this.checked) {
                //add event listeners to validate input.
                passwordBox.on("focusin", function() {
                    onFocusIn('passAlert');
                });
                passwordBox.on("focusout", function() {
                    onFocusOut('checkPass', $("#passwordBox"), '.passAlert')
                });
                usernameBox.on("focusin", function() {
                    onFocusIn('userAlert');
                });
                usernameBox.on("focusout", function() {
                    onFocusOut('checkUser', $("#username"), '.userAlert')
                });
                $("#loginTable").append(emailHtml);
				emailBox = $("#emailBox");
                $.cookie('registerCheck', '1');
                return;
            }

            $(" #emailRow ").remove();
            passwordBox.off();
            usernameBox.off();
			$.cookie('registerCheck', '0');
			onFocusIn('.userAlert');
            onFocusIn('.passAlert');
            return;
        });
		
		
		
        if (!$.cookie('registerCheck')) {
            $.cookie('registerCheck', '0');
        }
		
        var usernameBox = $("#username");
        var passwordBox = $("#passwordBox");
        var emailHtml = "<tr id='emailRow'> <th>Email</th> <td><input type=text id='emailBox'> </td> <td><span class=emailAlert></span></td></tr>";
		var emailBox;
		
		
        if ($.cookie('username')) {
            usernameBox.val($.cookie('username'));
        }
        if ($.cookie('password')) {
            passwordBox.val($.cookie('password'));
        }
		
        // add change event to registraton button.

        if ($.cookie('registerCheck') == 1) {
            $("#registerCheck").prop('checked', true).trigger("change");
        }
	
	$( "#connectButton" ).click(function() { onConnectClick(usernameBox, passwordBox, emailBox); }  );

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

	$.ajax({

        type: "POST",
        url: "chater.php",
        data: {
            request_type: 'login',
            name: usernameBox.val(),
			password: passwordBox.val(),
        },
        dataType: "html",
        async: true,
        success: function(msg) {
            alert('hi' + msg);
			if (msg) {
				alert('return response' + msg);
				// set return as login cookie
				$.cookie('login', msg);
				// redirect to chat page.
				//window.location.replace("index.html");

            } else {
				$('.registerAlert').html('Invalid username or password').css('color', 'red');

            }
			
        }
    });
    return;
}

function onRegister(usernameBox, passwordBox, emailBox) {
	if (!window.validUser) {
		$('.registerAlert').html('Invalid username! Perhaps it\'s already taken?').css('color', 'red');
		return;
	}
	if (!window.validPass) {
		$('.registerAlert').html('Invalid password! Perhaps it doesn\'t pass business rules...?').css('color', 'red');
		return;
	}
	
	// user and pass are valid apparently, let's register yall
	    $.ajax({

        type: "POST",
        url: "chater.php",
        data: {
            request_type: 'register',
            name: usernameBox.val(),
			password: passwordBox.val(),
			email: emailBox.val()
        },
        dataType: "html",
        async: true,
        success: function(msg) {
			alert(msg);
            if (msg) {
				$.cookie('login', msg);
				alert('account created');
				//window.location.replace("index.html");

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

function onFocusOut(requestType, inputBox, errorField) {

    switch (requestType) {
        case 'checkUser':
            $.cookie('username', inputBox.val());
            break;

        case 'checkPass':
            $.cookie('password', inputBox.val());
            break;
    }

    $.ajax({

        type: "POST",
        url: "chater.php",
        data: {
            request_type: requestType,
            name: inputBox.val()
        },
        dataType: "html",
        async: true,
        success: function(msg) {
            if (parseInt(msg) != -1) {
				$(errorField).html('Valid').css('color', 'green');
				(requestType == 'checkUser') ? window.validUser = true : window.validPass = true;
				
            } else {
                $(errorField).html('Invalid').css('color', 'red');
				(requestType == 'checkUser') ? window.validUser = false : window.validPass = false;

            }
        }
    });

    return;
}

window.onload = init;