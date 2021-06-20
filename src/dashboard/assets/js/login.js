$("#loginUser").click(function(){
    document.getElementById("error-text").innerHTML = ""
    req_data = {
        "username": document.getElementById("mobile").value,
        "password": document.getElementById("password").value,
    }
    $.post(BASE_URL+'auth/login/',req_data,function(data,status){
      localStorage.setItem('access',data['access'])
      localStorage.setItem('refresh',data['refresh'])
      window.location.href = "../dashboards/dashboard.html"
    }).fail(function(data){
      obj = data.responseJSON
      console.log(obj)
      if ('username' in obj){
        document.getElementById("error-text").innerHTML = "Mobile " + obj.username
      }else if ('password' in obj){
        document.getElementById("error-text").innerHTML = "Password " + obj.password
      }else if ('detail' in obj){
        document.getElementById("error-text").innerHTML = obj.detail
      }
    })
  })

  function togglePassword(){
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }