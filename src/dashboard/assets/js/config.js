var BASE_URL = "http://127.0.0.1:8000/";
var JOB_URL = "http://127.0.0.1:8000/job/v2/"
var TEACHER_URL = "http://127.0.0.1:8000/teacher/"
$("#logoutUser").click(function(){
    console.log("here")
    if(localStorage.getItem("access")){
        $.ajax({
            url:BASE_URL+'auth/logout/',
            type:'POST',
            data:{
                'refresh':localStorage.getItem("refresh")
            },
            headers:{
                'Authorization': 'Bearer '+localStorage.getItem("access"),
            },
            success: function (result) {
                localStorage.clear()
                window.location.href = "../examples/login.html"
            },
            error: function (error) {
         
            }
        })
    }else{
        localStorage.clear()
            window.location.href = "../examples/login.html"
    }
})

function buttonLockUnlock(id,val){
    document.getElementById(id).disabled = val;
}

function getJobResultContent(result,saveButton){
    // let temp = JSON.stringify(result);
    // console.log(temp)
    return `
    <div class="col-12 col-md-6 col-lg-4 mb-5">
        <div class="card shadow-soft border-light">
            <div class="card-body">
                <h3 class="card-title mt-3">${result.school}</h3>
                <div class="text-muted font-italic"><small style="color: darkgreen;">${result.entry_time.toString().slice(0, 10)}</small></div>
                <p class="card-text">
                    ${result.message}
                </p>
                <ul class="list-group d-flex justify-content-center mb-4">
                    <li class="list-group-item d-flex pl-0 pb-1">
                        
                        <div>${result.city}</div>    
                    </li>
                    <li class="list-group-item d-flex pl-0 pb-1">
                        
                        <div>${result.positions}</div>    
                    </li>
                    <li class="list-group-item d-flex pl-0 pb-1">
                        
                        <div>${result.subjects}</div> 
                    </li>
                </ul>
                <div class="row">
                    <div class="col">
                        <button onclick="openSwal(${result.id})" class="btn btn-primary">Apply</button>
                    </div>
                    <div class="col">
                        <button style="display:${saveButton}" onclick="saveJob(${result.id})" class="btn btn-secondary">Save</button>
                    </div>
                    <div class="col">
                    <a class="what-button" type="button" class="btn custom-btn custom-btn-bg custom-btn-link" href=
                    "whatsapp://send?text=A job opening for teaching in ${result.city} for post of ${result.positions},
                    To view more jobs for teachers visit our site https://jobportal.edbylearning.com?ids=${result.id} and Join our WhatsApp community for live job updates  https://chat.whatsapp.com/EZzx9EFTqA4Ft6uAyWq4ef"
                            data-action="share/whatsapp/share"
                            target="_blank"><i class="ni ni-world"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}