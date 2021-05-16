window.onload = function(){
    const urlParams = new URLSearchParams(window.location.search);
    let teacher_id = urlParams.get("teacher_id");
    getTeacherInfo(teacher_id)
}

function getTeacherInfo(teacher_id){
    $.ajax({
        url:TEACHER_URL+'public_profile/'+teacher_id,
        type:'GET',
        success: function (result) {
            setData(result)
        },
        error: function (error) {
            
        }
    })
}

function setData(data){
    document.getElementById("name").innerHTML = data.teacher.user.first_name+`
    <br><small style="font-size:14px;"><strong>${data.teacher.email}</strong></small>
    <br><small style="font-size:14px;"><strong>${data.teacher.mobile}</strong></small>
    <br><small style="font-size:14px;"><strong>${data.teacher.country}</strong></small>`;
    document.getElementById("description").innerHTML = data.teacher.description;
    let education = document.getElementById("education")
    education.innerHTML = ''
    data.education.forEach(element => {
        education.innerHTML+=`
        <li class="list-group-item d-flex px-0 pt-0 pb-2">
            <div class="icon icon-sm icon-success mr-4">
                <i class="far fa-check-circle"></i>
            </div>
            <div>I have completed ${element.degree} from ${element.institute_name} during ${element.start_year} - ${element.end_year}</div>
        </li>
        `
    }); 
    let experience = document.getElementById("experience")
    experience.innerHTML = ''
    data.experience.forEach(element => {
        if(element.ongoing){
            experience.innerHTML+=`
            <li class="list-group-item d-flex px-0 pt-0 pb-2">
                <div class="icon icon-sm icon-success mr-4">
                    <i class="far fa-check-circle"></i>
                </div>
                <div>I am working at ${element.institute} from ${element.start_year} where I am teaching ${element.subjects.split(",").join(" , ")} to students of class ${element.classes.split(",").join(" , ")}</div>
            </li>
            `
        }else{
            experience.innerHTML+=`
            <li class="list-group-item d-flex px-0 pt-0 pb-2">
                <div class="icon icon-sm icon-success mr-4">
                    <i class="far fa-check-circle"></i>
                </div>
                <div>I have worked at ${element.institute} from ${element.start_year} to ${element.end_year} where I taught ${element.subjects.split(",").join(" , ")} to students of class ${element.classes.split(",").join(" , ")}</div>
            </li>
            `
        }   
    }); 
    let qualification = document.getElementById("qualification")
    qualification.innerHTML = ''
    data.qualification.forEach(element => {
        qualification.innerHTML+=`
        <li class="list-group-item d-flex px-0 pt-0 pb-2">
            <div class="icon icon-sm icon-success mr-4">
                <i class="far fa-check-circle"></i>
            </div>
            <div>I have completed ${element.degree} in ${element.major_subject} during ${element.start_date} - ${element.end_date}</div>
        </li>
        `
    }); 

    let language = document.getElementById("language")
    language.innerHTML = ''
    data.language.forEach(element => {
        language.innerHTML+=`
        <div class="col-lg col-12 col-md-6 py-2">
            <div class="card timeline-card bg-soft shadow-soft border-light p-3">
                <div class="card-body p-4">
                    <h4 class="mb-3"><span>${element.language}</h4>
                    <ul class="list-group d-flex justify-content-center mb-4">
                        <li class="d-flex pl-0 pb-1">
                            <div>Read: ${LANG_CODE[element.can_read]}</div>    
                        </li>
                        <li class="d-flex pl-0 pb-1">
                            <div>Write: ${LANG_CODE[element.can_write]}</div>    
                        </li>
                        <li class="d-flex pl-0 pb-1">
                            <div>Speak: ${LANG_CODE[element.can_speak]}</div>    
                        </li>
                        <li class="d-flex pl-0 pb-1">
                            <div>Teach: ${LANG_CODE[element.can_teach]}</div>    
                        </li>
                        
                    </ul>
                </div>
            </div>
        </div>
        `
    }); 

    let preference = document.getElementById("preference")
    preference.innerHTML = ''
    data.preference.forEach(element => {
        preference.innerHTML+=`
            <small style="font-size:14px;">I am looking for the role of <strong style="font-size:20px;" class="ml-0 ml-md-2">${element.position.split(",").join(" , ")}</strong></small>
            <small style="font-size:14px;">in <strong style="font-size:20px;" class="ml-0 ml-md-2">${element.location.split(",").join(" , ")}</strong></small>
            <small style="font-size:14px;">and I am interested to teach <strong style="font-size:20px;" class="ml-0 ml-md-2">${element.subject.split(",").join(" , ")}</strong></small>
        `
    }); 
    
    let social = document.getElementById("social-sharing")
    social.innerHTML = ''
    social.innerHTML+=`

    <!--<a href="http://www.linkedin.com/shareArticle?mini=true&source=https://jobportal.edbylearning.com/front/pages/teacher-card.html?teacher_id=${data.teacher.id}" class="icon icon-lg text-gray mr-3">
        <i class="fab fa-linkedin"></i>
    </a>
    <a href="#" class="icon icon-lg text-gray mr-3">
        <i class="fab fa-facebook-f"></i>
    </a>-->
    <a data-action="share/whatsapp/share"
    target="_blank" href="whatsapp://send?text=Hi, I am ${data.teacher.user.first_name} and am very passionate teacher. I am looking for changing my job so please take a look at my resume https://jobportal.edbylearning.com/front/pages/teacher-card.html?teacher_id=${data.teacher.id}" class="icon icon-lg text-gray mr-3">
        <i class="fab fa-whatsapp"></i>
    </a>
    
    `


    

    
    
}