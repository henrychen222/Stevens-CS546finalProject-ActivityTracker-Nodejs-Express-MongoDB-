$(document).ready(function () {
    $("#password2").keyup(checkPasswordMatch);
});

function checkPasswordMatch() {
    var password = $("#password").val();
    var confirmPassword = $("#password2").val();

    if (password != confirmPassword){
        $("#password2alert").html("Passwords do not match!");
        $("#password2alert").show();
        $("#signup").attr("disabled", true);
    }else {
        $("#password2alert").hide();
        $("#signup").attr("disabled", false);

    }
}