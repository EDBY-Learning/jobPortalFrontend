var BASE_URL = "http://127.0.0.1:8000/";
var JOB_URL = "http://127.0.0.1:8000/job/v2/"
var TEACHER_URL = "http://127.0.0.1:8000/teacher/"

var LANG_CODE = {
    "1":`
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    `,
    "2":`
    <span class="fa fa-star checked"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    `,
    "3":`
    <span class="fa fa-star checked"></span>
    <span class="fa fa-star checked"></span>
    <span class="fa fa-star checked"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>`,
    "4":`
    <span class="fa fa-star checked"></span>
<span class="fa fa-star checked"></span>
<span class="fa fa-star checked"></span>
<span class="fa fa-star checked"></span>
<span class="fa fa-star checked"></span>`
}

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
                    <li class=" d-flex pl-0 pb-1">
                        
                        <div><strong>Location : </strong>${result.city}</div>    
                    </li>
                    <li class="d-flex pl-0 pb-1">
                        
                        <div><strong> Designation : </strong>${result.positions}</div>    
                    </li>
                    <li class="d-flex pl-0 pb-1">
                        
                        <div><strong> Subjects: </strong>${result.subjects}</div> 
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
                            target="_blank"><i class="fab fa-whatsapp"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}

function makeJobPostModal(result){
    return `
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div class="modal-body">
            <div class="col-12 d-flex">
            <div class="card profile-card-5 flex-fill">
                <div class="card-img-block">
                    <img class="card-img-top" src="${result.image}" alt="Card image cap" onerror="this.style.opacity='0'">
                    <img class="card-img-top" src="${result.image_url}" alt="Card image cap" onerror="this.style.opacity='0'">
                </div>
                <div class="card-body pt-0">
                    <h5 class="card-title" style="color: #ff8400;"><strong>School: </strong>${result.school}</h5>
                    <p class="card-text"><strong>City: </strong>${result.city}</p>
                    <p class="card-text"><strong>Hiring for Positions: </strong> ${result.positions}</p>
                    <p class="card-text"><strong>Hiring for Subjects: </strong> ${result.subjects}</p>
                    <p class="card-text"><strong>Mobile Number: </strong> ${result.contact}</p>
                    <p class="card-text"><strong>Email: </strong> ${result.email}</p>
                    <p class="card-text"><strong>Message: </strong> ${result.message}</p>
                </div>
                    
            </div>
        </div>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> 
            </div>
        </div>
        </div>
    </div>`
}