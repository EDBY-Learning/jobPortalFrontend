window.addEventListener('load',getPrefernce)

function getPrefernce(){
    if(!localStorage.getItem("access")){
        refreshTokenAsAuthFailed()
        return;
    }
    $.ajax({
        url:TEACHER_URL+'preference/1/',
        type:'GET',
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        },
        success: function (result) {
            setData(result)
        },
        error: function (error) {
            if(error.status==401){
                refreshTokenAsAuthFailed()
            }
        }
    })
}

function setData(data){
    if(data['country']){
        document.getElementById("country").value = data['country']
    }
    if(data['location']){
        document.getElementById("location").value = data['location']
        set_tags(data['location'].split(","),"location_tag")
    }
    if(data['position']){
        document.getElementById("position").value = data['position']
        set_tags(data['position'].split(","),"position_tag")
    }
    if(data['subject']){
        document.getElementById("subject").value = data['subject']
        set_tags(data['subject'].split(","),"subject_tag")
    }
    
}

function set_tags(array,id){
    let container = document.getElementById(id)
    container.innerHTML = ``
    array.forEach(element => {
        container.innerHTML+=`
        <a class="post-tag" title="${id} tagged as '${element}'" rel="tag">${element}</a>
        `
    });
}

$("#savePrefernece").click(function(){
    let country  = document.getElementById("country").value
    let position = document.getElementById("position").value
    let location = document.getElementById("location").value
    let subject = document.getElementById("subject").value
    if(country==""){
        document.getElementById("country-error-text").innerHTML = "Country is required field!!"
        return;
    }
    if(location==""){
        document.getElementById("location-error-text").innerHTML = "By default City is set as country"
        location = country;
    }else{
        document.getElementById("location-error-text").innerHTML = ""
    }
    if(position==""){
        document.getElementById("teacher-error-text").innerHTML = "By default Teacher is be selected"
        position = "Teacher"
    }else{
        document.getElementById("teacher-error-text").innerHTML = ""
    }
    if(subject==""){
        document.getElementById("subject-error-text").innerHTML = "Subject is required field!!"
        return;
    }

    buttonLockUnlock('savePrefernece',true)
    $.ajax({
        url:TEACHER_URL+'preference/1/',
        type:'PUT',
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        },
        data:{
            'location': location,
            'country' : country,
            'position' : position,
            'subject' : subject
        },
        success: function (result) {
            setData(result)
            document.getElementById("country-error-text").innerHTML = ''
            document.getElementById("subject-error-text").innerHTML = ''
        },
        error: function (error) {
            if(error.status==401){
                refreshTokenAsAuthFailed()
            }
        },
        complete: function(){
            buttonLockUnlock('savePrefernece',false)
        }
    })
})