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

$("#recoveryLink").click(function(){
    let mobile  = document.getElementById("mobile").value
    // let email = document.getElementById("email").value

    if(mobile==""){
        document.getElementById("error-text").innerHTML = "Provide Mobile Number used for registration!!"
        return;
    }else{
        document.getElementById("error-text").innerHTML = ''
    }
    // if(email==""){
    //     document.getElementById("error-text").innerHTML = "Provide email used for registration!!"
    //     return;
    // }else{
    //     document.getElementById("error-text").innerHTML = ''
    // }

    buttonLockUnlock('recoveryLink',true)
    $.ajax({
        url:BASE_URL+'auth/get_reset_password_token/',
        type:'POST',
        data:{
            // 'email': email,
            'username' : mobile
        },
        success: function (result) {
            document.getElementById("mobile").value = ''
            // document.getElementById("email").value = ''
            document.getElementById("success-message").innerHTML = "Succesfully data sent to admin,"+ 
            "please have patience we will respond soon"
        },
        error: function (error) {
            if(error.status==401){
                refreshTokenAsAuthFailed()
            }
            document.getElementById("error-text").innerHTML =  error.responseText
        },
        complete: function(){
            buttonLockUnlock('recoveryLink',false)
        }
    })
  })