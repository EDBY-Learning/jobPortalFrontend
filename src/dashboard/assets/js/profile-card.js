var teacher_id;
window.onload = function(){
    const urlParams = new URLSearchParams(window.location.search);
    teacher_id = urlParams.get("teacher_id");
    getTeacherInfo()
}

function getTeacherInfo(){
    $.ajax({
        url:TEACHER_URL+'public_profile/'+teacher_id+'/',
        type:'GET',
        success: function (result) {
            setData(result)
        },
        error: function (error) {
            document.getElementById("name").innerHTML = 'Wrong Profile!! Or Account Deleted'
        }
    })
}

function setData(data){
    document.getElementById("name").innerHTML = data.teacher.user.first_name
    document.getElementById("country").innerHTML = data.teacher.country 
    document.getElementById("email").innerHTML = data.teacher.email 
    document.getElementById("detail").innerHTML = data.teacher.description 

    let social = document.getElementById("social-sharing")
    social.innerHTML = ''
    social.innerHTML+=`

    <a target="_blank" href="http://www.facebook.com/sharer.php?u=https%3A%2F%2Fjobportal.edbylearning.com/dashboard/pages/examples/profile-card.html?teacher_id=${data.teacher.id}" class="icon icon-lg text-gray mr-3">
        <i class="fab fa-facebook-f"></i>
    </a>
    <a target="_blank" href="whatsapp://send?text=Hi, I am ${data.teacher.user.first_name} and am very passionate teacher. I am looking for changing my job so please take a look at my resume https://jobportal.edbylearning.com/dashboard/pages/examples/profile-card.html?teacher_id=${data.teacher.id}" class="icon icon-lg text-gray mr-3">
        <i class="fab fa-whatsapp"></i>
    </a>
    <a target="_blank" class="icon icon-lg text-gray mr-3" href="mailto:?subject=EDBY%20Job%20Portal&body=Hi%2C%20I%20am%20${data.teacher.user.first_name}%20and%20am%20very%20passionate%20teacher.%20I%20am%20looking%20for%20changing%20my%20job%20so%20please%20take%20a%20look%20at%20my%20resume%20https%3A%2F%2Fjobportal.edbylearning.com%2Fdashboard%2Fpages%2Fexamples%2Fprofile-card.html%3Fteacher_id%3D${data.teacher.id}">
        <i  class="fas fa-envelope"></i>
    </a>
    <a target="_blank" class="icon icon-lg text-gray mr-3" href="sms:?body=EDBY%20Job%20Portal%20%3A%20Hi%2C%20I%20am%20${data.teacher.user.first_name}%20and%20am%20very%20passionate%20teacher.%20I%20am%20looking%20for%20changing%20my%20job%20so%20please%20take%20a%20look%20at%20my%20resume%20https%3A%2F%2Fjobportal.edbylearning.com%2Fdashboard%2Fpages%2Fexamples%2Fprofile-card.html%3Fteacher_id%3D${data.teacher.id}">
        <i class="fas fa-sms"></i>
    </a>
    ` 
}

function goToResume(){
    window.location.href = "../../../front/pages/teacher-card.html?teacher_id="+teacher_id
}

function makeResume(){
    window.location.href = "../../../dashboard/pages/examples/login.html"
}