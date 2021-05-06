$("#changePassword").click(function(){
    let password  = document.getElementById("password").value
    let new_password = document.getElementById("new_password").value
    let confirm_password = document.getElementById("confirm_password").value
    if(password==""){
        document.getElementById("password-error-text").innerHTML = "Provide Current Password!!"
        return;
    }else{
        document.getElementById("password-error-text").innerHTML = ''
    }
    if(new_password==""){
        document.getElementById("new_password-error-text").innerHTML = "This is required!!"
        return;
    }else{
        document.getElementById("new_password-error-text").innerHTML = ''
    }
    if(confirm_password==""){
        document.getElementById("confirm_password-error-text").innerHTML = "This is required!!"
        return;
    }else{
        document.getElementById("confirm_password-error-text").innerHTML = ''
    }
    if(confirm_password!=new_password){
        document.getElementById("confirm_password-error-text").innerHTML = "Password doesnot match!!"
        return;
    }else{
        document.getElementById("confirm_password-error-text").innerHTML = ''
    }
    if(confirm_password.length < 8){
        document.getElementById("confirm_password-error-text").innerHTML = "Password must be of length 8!!"
        return;
    }else{
        document.getElementById("confirm_password-error-text").innerHTML = ''
    }

    buttonLockUnlock('changePassword',true)
    $.ajax({
        url:BASE_URL+'auth/change_password/',
        type:'POST',
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        },
        data:{
            'password': password,
            'new_password' : new_password,
            'confirm_password' :confirm_password
        },
        success: function (result) {
            document.getElementById("password").value = ''
            document.getElementById("new_password").value = ''
            document.getElementById("confirm_password").value = ''
            document.getElementById("success-message").innerHTML = "Password Changed Succesfully"
        },
        error: function (error) {
            document.getElementById("confirm_password-error-text").innerHTML =  error.responseText
        },
        complete: function(){
            buttonLockUnlock('changePassword',false)
        }
    })
})