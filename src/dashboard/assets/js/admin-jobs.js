const dataArea = document.getElementById("dataArea")
const info = document.getElementById("preferenceInfo") 
window.addEventListener('load',getAdminJob)

function getAdminJob(){
    if(!localStorage.getItem("access")){
        document.getElementById("unauth-header").innerHTML = "Login to Apply"
        return;
    }
    $.ajax({
        url:JOB_URL+'admin_job_for_teacher/',
        type:'GET',
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        },
        success: function (result) {
            document.getElementById("unauth-panel").style.display = 'none'
            document.getElementById("panel").style.display = 'block'
            setData(result)
            changeStatus()
            info.innerHTML = ''
            info.innerHTML+= `
            Verified and Urgent Hiring Jobs from <strong style="font-weight:bolder;font-size:24px;color:black;">${result.country}</strong>
            as it is set in your prefernce, change country where you are looking for Job 
            `
        },
        error: function (error) {
            if(error.status==401){
                refreshTokenAsAuthFailed()
                return;
            }
            document.getElementById("unauth-header").innerHTML = "Failed to log you in! "+error.responseText
        }
    })
}

function setData(data){
    dataArea.innerHTML = ''
    // console.log(data)
    data.data.forEach(element => {
        // console.log(element.isByEdby=='True')
        let showApply = element.isByEdby=='True'?'block':'none'
        let showContact = element.isByEdby=='True'?'none':'block'
        dataArea.innerHTML+= `
        <h3 class="mb-4" style="color: black; font-weight:bolder;">${element.school}</h3>
        <div class="font-italic"><div style="color: darkgreen;">${element.city}</div></div>
        <div class="font-italic"><div style="color: red;">${element.entry_time.toString().slice(0, 10)}</div></div>
        <div class="pl-lg-4">
            <div class="row">
            <div class="col-lg-6">
                <div>
                    <p style="color: black;font-size:17px;">${element.message}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div >
                <p style="font-size:18px;">
                    Hiring <strong style="color: black;font-size:17px;font-weight:bold;"> ${element.positions}</strong> 
                    for subjects <strong style="color: black;font-size:17px;font-weight:bold;">${element.subjects}</strong>
                </p>
                </div>
            </div>
            <!--<div style="display:${showContact}" class="col-md-6">
                <div >
                <p style="font-size:18px;">
                    Email Resume at <strong style="color: black;font-size:17px;font-weight:bold;"> ${element.email}</strong> 
                </p>
                <p style="font-size:18px;">
                    Contact the person at <strong style="color: black;font-size:17px;font-weight:bold;"> ${element.contact}</strong>
                </p>
                </div>
            </div>-->
        </div>
        
        <div class="row">
            <div class="col">
                <button id="Jobid_${element.id}"  onclick="applyForAdminJob(${element.id})" class="btn btn-danger">Apply</button>
                <!--<button style="display:${showContact}" class="btn btn-info" disabled="true">Apply on given contact</button>-->
            </div>
        </div>

        <hr class="my-4" />
        `
    });   
}

function applyForAdminJob(id){
    buttonLockUnlock("Jobid_"+id,true)
    $.ajax({
        url:TEACHER_URL+'apply_for_job/?jobID='+id,
        type:'GET',
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        },
        success: function (result) {
            let temp = document.getElementById("Jobid_"+id);
            temp.innerHTML = "Applied";
            temp.className = "btn btn-success"
        },
        error: function (error) {
            if(error.status==401){
                refreshTokenAsAuthFailed()
            }
            buttonLockUnlock("Jobid_"+id,true)
        }
    })
}

function changeStatus(){
    $.ajax({
        url:TEACHER_URL+'apply_for_job/',
        type:'POST',
        data:{},
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        },
        success: function (result) {
            result.data.forEach(element=>{
                buttonLockUnlock("Jobid_"+element.id,true)
                let temp = document.getElementById("Jobid_"+element.id);
                temp.innerHTML = APPLICATION_STATUS[element.status];
                if(+element.status==-1){
                    temp.className = "btn btn-warning"
                }else{
                    temp.className = "btn btn-success"
                }
            })
        },
        error: function (error) {
            if(error.status==401){
                refreshTokenAsAuthFailed()
            }
        }
    })
}