
function init() {

		// check to see if user is logged in, if so redirect.
		
		if ($.cookie('login')) {
			window.location.replace("index.html");
		}
		
		
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
	$('.registerAlert').html('');

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
			if (msg) {
				// set return as login cookie
				$.cookie('login', msg);
				window.location.replace("index.html");

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
				
            } else {
                $(errorField).html('Invalid').css('color', 'red');

            }
        }
    });

    return;
}

window.onload = init;