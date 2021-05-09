window.onload = function(){
    getPersonalData()
}

var educationData = null;
var experienceData = null;
var languageData = null;

function updateLocalData(dataType,operation,id,result){
    if(dataType=="education"){
        if(id){
            var index = educationData.findIndex(item => item.id === id)
            if(operation=="create"){
                educationData.splice(index, 1, result)
            }else if(operation=='delete'){
                educationData.splice(index, 1)
            }
        }else{
            educationData.push(result)
        }
    }else if(dataType=="experience"){
        if(id){
            var index = experienceData.findIndex(item => item.id === id)
            if(operation=="create"){
                experienceData.splice(index, 1, result)
            }else if(operation=='delete'){
                experienceData.splice(index, 1)
            }
        }else{
            experienceData.push(result)
        }
    }else if(dataType=="language"){
        if(id){
            var index = languageData.findIndex(item => item.id === id)
            if(operation=="create"){
                languageData.splice(index, 1, result)
            }else if(operation=='delete'){
                languageData.splice(index, 1)
            }
        }else{
            languageData.push(result)
        }
    }else{
        alert("wrong type")
    }
}

function openModal(modalName,id){
    if(modalName=='educationModal'){
        if(!id){
            fillEducationDataModal(null)
        }
        data = educationData.find(x => x.id == id)
        if(data){
            fillEducationDataModal(data)
        }else{
            fillEducationDataModal(null)
        }
    }else if(modalName=='experienceModal'){
        if(!id){
            fillExperienceDataModal(null)
        }
        data = experienceData.find(x => x.id == id)
        if(data){
            fillExperienceDataModal(data)
        }else{
            fillExperienceDataModal(null)
        }
    }else if(modalName=='languageModal'){
        if(!id){
            fillLanguageDataModal(null)
        }
        data = languageData.find(x => x.id == id)
        if(data){
            fillLanguageDataModal(data)
        }else{
            fillLanguageDataModal(null)
        }
    }
 
    $('#'+modalName).modal('show');
}

function getPersonalData(){
    $.ajax({
        url:TEACHER_URL+'profile/1/',
        type:'GET',
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        },
        success: function (result) {
            setBasicInfo(result['teacher'])
            educationData = result['education']
            setEducationInfo(result['education'])
            experienceData = result['experience']
            setExperience(result['experience'])
            languageData = result['language']
            setLangauge(result['language'])
        },
        error: function (error) {
            if(error.status==401){
                LogoutUserAsFailedAuth()
            }
        }
    })
}

function setBasicInfo(result){
    document.getElementById("basic_info_id").value = result['id']
    document.getElementById("first_name").value = result['user']['first_name']
    document.getElementById("email").value = result['email']
    document.getElementById("mobile").value = result['country_code']+'-'+result['mobile']
    document.getElementById("dob").value = result['dob']
    document.getElementById("description").value = result['description']
}

function getEducationTemplate(data){
    return `
    <div class="col-12 col-md-6 col-lg-4 mb-5">
        <div class="card shadow-soft border-light">
            <div class="card-body">
                <h3 class="card-title mt-3">${data.degree}</h3>
                <div style="display: none;" class="text-muted font-italic">${data.id}</div>
                <div class="text-muted font-italic"><small style="color: darkgreen; font-size:17px;">${data.institute_name}</small></div>
                <p class="card-text">
                    (${data.start_year} - ${data.end_year})
                </p>
                <ul class="list-group d-flex justify-content-center mb-4">
                    <li class="d-flex pl-0 pb-1">
                        <div>Score: ${data.score}</div>    
                    </li>
                    
                </ul>
                <div class="row">
                    <div class="col">
                        <button onclick="openModal('educationModal',${data.id})" class="btn btn-primary">Edit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}

function setEducationInfo(result){
    let container = document.getElementById("educationInfoArea")
    container.innerHTML = ''
    result.forEach(element => {
        container.innerHTML+=getEducationTemplate(element)
    });
}



function createEducationInfo(type){
    let data = {}
    id = document.getElementById("educationID").value
    method = null
    url = TEACHER_URL+'education/'
    data['institute_name'] = document.getElementById("educationInstitute").value
    data['degree'] = document.getElementById("educationDegree").value
    data['start_year'] = document.getElementById("educationStartYear").value
    data['end_year'] = document.getElementById("educationEndYear").value
    data['score'] = document.getElementById("educationScore").value
    if(type == "create" && id){
        method = "PUT"
        url=url+id+'/'
    }else if(type == "delete" && id){
        if (confirm("Are you sure you want to delete") == true) {
            method = "DELETE"
            url=url+id+'/'
            data = {}
        } else {
            return false;
        }
        
    }else{
        method = "POST"
    }
    
    buttonLockUnlock('makeEducationRequest',true)
    $.ajax({
        url:url,
        type:method,
        data:data,
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        },
        success: function (result) {
            console.log(data)
            fillEducationDataModal(null)
            $('#educationModal').modal('hide');
            updateLocalData('education',type,id,result)
            setEducationInfo(educationData)
        },
        error: function (error) {
            if(error.status==401){
                LogoutUserAsFailedAuth()
            }
            document.getElementById("education-error-text").innerHTML = "All fields are required and year should be only 4 digit(like 1998) !!"
        },
        complete: function(){
            buttonLockUnlock('makeEducationRequest',false)
        }
    })
}

function fillEducationDataModal(data){
    if(!data){
        document.getElementById("educationID").value = ''
        document.getElementById("educationInstitute").value = ''
        document.getElementById("educationDegree").value = ''
        document.getElementById("educationStartYear").value = ''
        document.getElementById("educationEndYear").value = ''
        document.getElementById("educationScore").value = ''
    }else{
        document.getElementById("educationID").value = data.id
        document.getElementById("educationInstitute").value = data.institute_name
        document.getElementById("educationDegree").value = data.degree
        document.getElementById("educationStartYear").value = data.start_year
        document.getElementById("educationEndYear").value = data.end_year
        document.getElementById("educationScore").value = data.score
    }
}
                
function getExperienceTemplate(data){
    return `
    <div class="col-12 col-md-6 col-lg-4 mb-5">
        <div class="card shadow-soft border-light">
            <div class="card-body">
                <div style="display: none;" class="text-muted font-italic">${data.id}</div>
                <h3 class="card-title mt-3">School/Tution: ${data.institute}</h3>
                `+
                `${data.ongoing ? 
                    `<div class="text-muted font-italic"><small style="color: darkgreen; font-size:17px;">Ongoing</small></div>
                    <p class="card-text">
                        (${data.start_year} - )
                    </p>
                    ` 
                : `
                <p class="card-text">
                    (${data.start_year} - ${data.end_year})
                </p>
                `}`
                +`
                
                <ul class="list-group d-flex justify-content-center mb-4">
                    <li class="d-flex pl-0 pb-1">
                        <div>Subjects: ${data.subjects}</div>    
                    </li>
                    <li class="d-flex pl-0 pb-1">
                        <div>Classes: ${data.classes}</div>    
                    </li>
                    
                </ul>
                <div class="row">
                    <div class="col">
                        <button onclick="openModal('experienceModal',${data.id})" class="btn btn-primary">Edit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}

function setExperience(result){
    let container = document.getElementById("experienceArea")
    container.innerHTML = ''
    result.forEach(element => {
        container.innerHTML+=getExperienceTemplate(element)
    });
}
function fillExperienceDataModal(data){
    if(!data){
        document.getElementById("experienceID").value = ''
        document.getElementById("experienceInstitute").value = ''
        document.getElementById("experienceStartYear").value = ''
        document.getElementById("experienceEndYear").value = ''
        document.getElementById("experienceOngoing").checked = ''
        document.getElementById("experienceSubjects").value = ''
        document.getElementById("experienceClasses").value = ''
    }else{
        document.getElementById("experienceID").value = data.id
        document.getElementById("experienceInstitute").value = data.institute
        document.getElementById("experienceStartYear").value = data.start_year
        document.getElementById("experienceEndYear").value = data.end_year
        document.getElementById("experienceOngoing").checked = data.ongoing
        document.getElementById("experienceSubjects").value = data.subjects
        document.getElementById("experienceClasses").value = data.classes
    }
}

function createExperienceInfo(type){
    let data = {}
    id = document.getElementById("experienceID").value
    method = null
    url = TEACHER_URL+'experience/'

    data['institute'] = document.getElementById("experienceInstitute").value
    data['start_year'] = document.getElementById("experienceStartYear").value
    data['end_year'] = document.getElementById("experienceEndYear").value
    data['ongoing'] = document.getElementById("experienceOngoing").checked
    data['subjects'] = document.getElementById("experienceSubjects").value
    data['classes'] = document.getElementById("experienceClasses").value

    if(type == "create" && id){
        method = "PUT"
        url=url+id+'/'
    }else if(type == "delete" && id){
        if (confirm("Are you sure you want to delete") == true) {
            method = "DELETE"
            url=url+id+'/'
            data = {}
        } else {
            return false;
        }
        
    }else{
        method = "POST"
    }
    
    buttonLockUnlock('makeExperienceRequest',true)
    $.ajax({
        url:url,
        type:method,
        data:data,
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        },
        success: function (result) {
            console.log(data)
            fillExperienceDataModal(null)
            $('#experienceModal').modal('hide');
            updateLocalData('experience',type,id,result)
            setExperience(experienceData)
        },
        error: function (error) {
            if(error.status==401){
                LogoutUserAsFailedAuth()
            }
            document.getElementById("experience-error-text").innerHTML = "All fields are required and year should be only 4 digit(like 1998) !!"
        },
        complete: function(){
            buttonLockUnlock('makeExperienceRequest',false)
        }
    })
}

function getLanguageTemplate(data){
    return `
    <div class="col-12 col-md-6 col-lg-4 mb-5">
        <div class="card shadow-soft border-light">
            <div class="card-body">
                <h3 class="card-title mt-3">${data.language}</h3>
                <ul class="list-group d-flex justify-content-center mb-4">
                    <li class="d-flex pl-0 pb-1">
                        <div>Read: ${LANG_CODE[data.can_read]}</div>    
                    </li>
                    <li class="d-flex pl-0 pb-1">
                        <div>Write: ${LANG_CODE[data.can_write]}</div>    
                    </li>
                    <li class="d-flex pl-0 pb-1">
                        <div>Speak: ${LANG_CODE[data.can_speak]}</div>    
                    </li>
                    <li class="d-flex pl-0 pb-1">
                        <div>Teach: ${LANG_CODE[data.can_teach]}</div>    
                    </li>
                    
                </ul>
                <div class="row">
                    <div class="col">
                        <button onclick="openModal('languageModal',${data.id})" class="btn btn-primary">Edit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}

function fillLanguageDataModal(data){
    if(!data){
        document.getElementById("languageID").value = ''
        document.getElementById("languageName").value = ''
        document.getElementById("language_can_read").value = ''
        document.getElementById("language_can_speak").value = ''
        document.getElementById("language_can_write").value = ''
        document.getElementById("language_can_teach").value = ''
    }else{
        document.getElementById("languageID").value = data.id
        document.getElementById("languageName").value = data.language
        document.getElementById("language_can_read").value = data.can_read
        document.getElementById("language_can_speak").value = data.can_speak
        document.getElementById("language_can_write").value = data.can_write
        document.getElementById("language_can_teach").value = data.can_teach
    }
}

function createLanguageInfo(type){
    let data = {}
    id = document.getElementById("languageID").value
    method = null
    url = TEACHER_URL+'language/'

    data['language'] = document.getElementById("languageName").value 
    data['can_read'] = document.getElementById("language_can_read").value
    data['can_speak'] = document.getElementById("language_can_speak").value
    data['can_write'] = document.getElementById("language_can_write").value
    data['can_teach'] = document.getElementById("language_can_teach").value

    if(type == "create" && id){
        method = "PUT"
        url=url+id+'/'
    }else if(type == "delete" && id){
        if (confirm("Are you sure you want to delete") == true) {
            method = "DELETE"
            url=url+id+'/'
            data = {}
        } else {
            return false;
        }
        
    }else{
        method = "POST"
    }
    
    buttonLockUnlock('makeLanguageRequest',true)
    $.ajax({
        url:url,
        type:method,
        data:data,
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        },
        success: function (result) {
            fillLanguageDataModal(null)
            $('#languageModal').modal('hide');
            updateLocalData('language',type,id,result)
            setLangauge(languageData)
        },
        error: function (error) {
            if(error.status==401){
                LogoutUserAsFailedAuth()
            }
            document.getElementById("language-error-text").innerHTML = "All fields are required and year should be only 4 digit(like 1998) !!"
        },
        complete: function(){
            buttonLockUnlock('makeLanguageRequest',false)
        }
    })
}

function setLangauge(result){
    let container = document.getElementById("languageArea")
    //console.log(LANG_CODE)
    container.innerHTML = ''
    result.forEach(element => {
        container.innerHTML+=getLanguageTemplate(element)
    });
}

$("#saveBasicInfo").click(function(){
    saveBasicInfo()
})

function saveBasicInfo(){
    id = document.getElementById("basic_info_id").value
    dob = document.getElementById("dob").value
    description = document.getElementById("description").value
    if(!id){
        alert("Some Error!! Refresh Page")
    }
    
    buttonLockUnlock('saveBasicInfo',true)
    $.ajax({
        url:TEACHER_URL+'register/'+id+'/',
        type:'PUT',
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        },
        data:{
            'dob' : dob,
            'description' : description
        },
        success: function (result) {
            setBasicInfo(result)
        },
        error: function (error) {
            console.log(error)
            if(error.status==401){
                LogoutUserAsFailedAuth()
            }
        },
        complete: function(){
            buttonLockUnlock('saveBasicInfo',false)
        }
    })
}