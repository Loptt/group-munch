function authenticate(user) {
    let url = '/api/login';

    $.ajax({
        url: url,
        method: "POST",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(user),
        success: function(responseJSON) {
            console.log("authenticated");
            localStorage.setItem("token", responseJSON.token);
            location.href = 'index.html';
        },
        error: function(error) {
            console.log(error);
        }
    })
}

function watchForm() {
    $('#loginForm').on('submit', function(event) {
        event.preventDefault();

        let email, password;

        email = $('#email').val();
        password = $('#password').val();

        user = {
            email,
            password
        }

        authenticate(user);
    })
}

function init() {
    watchForm();
}

init();