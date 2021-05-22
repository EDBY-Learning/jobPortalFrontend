var teacher_id;
window.onload = function(){
    const urlParams = new URLSearchParams(window.location.search);
    teacher_id = urlParams.get("teacher_id");
    // getTeacherInfo()
}

function getTeacherInfo(){
    $.ajax({
        url:TEACHER_URL+'public_profile/'+teacher_id+'/',
        type:'GET',
        success: function (result) {
            setData(result)
        },
        error: function (error) {
            
        }
    })
}

function setData(data){
    console.log(data)
}

function goToResume(){
    window.location.href = "../../../front/pages/teacher-card.html?teacher_id="+teacher_id
}