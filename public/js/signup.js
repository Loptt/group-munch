function createUser(newUser) {
    let url = '/api/create-user';

    $.ajax({
        url: url,
        method: "POST",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(newUser),
        success: function(responseJSON) {
            location.href = 'login.html';
        },
        error: function(error) {
            console.log(error);
        }
    })
}

function watchForm() {
    $('#signupForm').on('submit', function(event) {
        event.preventDefault();

        let firstName, lastName, email, p1, p2;

        firstName = $('#firstname').val();
        lastName = $('#lastname').val();
        email = $('#email').val();
        p1 = $('#password1').val();
        p2 = $('#password2').val();

        if (p1 !== p2) {
            alert("Passwords need to coincide");
            return;
        }

        let password = p1;

        newUser = {
            firstName,
            lastName,
            email,
            password,
        }

        createUser(newUser);
    })
}

function init() {
    watchForm();
}

init();