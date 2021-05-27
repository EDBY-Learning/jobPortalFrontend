const blogArea = document.getElementById("blogArea")
const blogCommentArea = document.getElementById("blogCommentArea")
const urlParams = new URLSearchParams(window.location.search);
blog_id = urlParams.get("blog_id");

var blogComments = []; 
var blogData = [];
var likesData = [];

window.addEventListener('load',getBlog)

function removeQueryParam(){
    urlParams.delete('blog_id')
    document.getElementById("commentForm").style.display = "none"
    blogCommentArea.style.display = "none"
    // document.getElementById("blogHome").style.display = "none"
    let headers={};
    if(localStorage.getItem("access")){
        headers = {
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        }
    }
    $.ajax({
        url:BLOG_URL+'all_blogs/',
        type:'GET',
        headers:headers,
        success: function (result) {
            blogData = result['blogs']
            likesData = result['likes']
            blogArea.innerHTML = "";
            blogData.forEach((element)=>{
                card = getBlogContent(element,'')
                blogArea.innerHTML+=card
            })
        },
        error: function (error) {
            console.log(error)
            if(error.status==401){
                refreshTokenAsAuthFailed()
            }
        }
    })
}

function getBlog(){
    document.getElementById("changePageId").style.display = 'none'
    blogCommentArea.style.display = "block"
    let headers={};
    if(localStorage.getItem("access")){
        headers = {
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        }
        document.getElementById("loginInfo").style.display ="none"
    }
    if(blog_id){
        document.getElementById("commentForm").style.display = "block"
        // document.getElementById("blogHome").style.display = "block"
        $.ajax({
            url:BLOG_URL+'view_job_blog_detail/'+blog_id+'/',
            type:'GET',
            headers:headers,
            success: function (result) {
                likesData = [result.userLike]
                blogArea.innerHTML = "";
                card = getBlogContent(result.blog,'none')
                
                blogArea.innerHTML+=card
                blogComments = result.comment
                makeComments(blogComments)
            },
            error: function (error) {
                blogArea.innerHTML = "";
                blogArea.innerHTML = `
                    <h1>404 Not found or Post has been deleted!!</h1>
                
                `
                document.getElementById("commentForm").style.display = "none"
            }
        })
    }else{
        removeQueryParam()
    }
}

function fetchLiked(id){
    if(likesData.length==0 || !likesData[0]){
        return `<a id="like_${id}" href="javascript:likePost('${id}','1')" class="card-link"> <i class="far fa-thumbs-up"></i> Like</a>`
    }
    let index;
    if('blogId' in likesData[0]){
        index = likesData.findIndex(item => item.blogId == id)
    } else{
        index = likesData.findIndex(item => item.blog.id == id)  
    }
    
   
    if(index!=-1 && (likesData[index]['like']=="True" || likesData[index]['like'])){
        return `<a id="like_${id}" href="javascript:void(0)" class="card-link"> <i class="fas fa-thumbs-up"></i> Liked</a>`
    }else{
        return `<a id="like_${id}" href="javascript:likePost('${id}','1')" class="card-link"> <i class="far fa-thumbs-up"></i> Like</a>`
    } 
}

function likePost(blogId,like){
    if(!localStorage.getItem("access")){
        document.getElementById("error-text").innerHTML = "Login to Like!!"
        return;
    }
    $.ajax({
        url:BLOG_URL+'like_blog/',
        type:'POST',
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        },
        data:{
            like:like,
            blogId:blogId
        },  
        success: function (result) {
            let temp  = document.getElementById('like_'+blogId)
            if(+like==1){
                temp.innerHTML = `<i class="fas fa-thumbs-up"></i> Liked`
                temp.href = `javascript:void(0)`//javascript:likePost('${blogId}','0')
            }else{
                temp.innerHTML  =`<i class="far fa-thumbs-up"></i> Like`
                temp.href = `javascript:likePost('${blogId}','1')`
            }
        },
        error: function (error) {
            document.getElementById("error-text").innerHTML = "Login to Like!!"
            
        }
    })
}


function makeComments(data){
    blogCommentArea.innerHTML = ''
    data.forEach(element => {
        let card = getBlogCommentContent(element)
        blogCommentArea.innerHTML+=card
    });
    
}

function getBlogCommentContent(data){
    return `
    <div style="width: 90%; display: block;margin-left: auto;margin-right: auto;" class="col-12 col-md-8 card gedf-card shadow-soft border-light">
        <div class="card-header">
            
            <div class="panel-body">
                <header class="text-left">
                <div class="comment-user"><i class="fas fa-user"></i> ${data.user.first_name}</div>
                <i class="fa fa-clock-o"></i> ${timeDifference(data.entry_time.toString())}
                </header>
            </div>
            
        </div>
        <div class="card-body">
            <p style="font-size:16px;" class="card-text">
                ${data.comment}
            </p>
        </div>
    </div>
    `
}

function commentOnPost(){
    document.getElementById("error-text").innerHTML = ''
    if(document.getElementById("commentBox").value.trim()==""){
        return;
    }
    if(!localStorage.getItem("access")){
        document.getElementById("error-text").innerHTML = "Login to comment!!"
        return;
    }
    if(document.getElementById("commentBox").value.trim()!="" && localStorage.getItem("access")){
        $.ajax({
            url:BLOG_URL+'add_job_blog_comment/',
            type:'POST',
            headers:{
                'Authorization': 'Bearer '+localStorage.getItem("access"),
            },
            data:{
                blogId:blog_id,
                comment:document.getElementById("commentBox").value
            },
            success: function (result) {
                blogComments.unshift(result)
                makeComments(blogComments)
                document.getElementById("commentBox").value = ""
            },
            error: function (error) {
                console.log(error)
            }
        })
    }
    
}

function toTop(){
    document.getElementById("blogHome").scrollIntoView({behavior: 'smooth'});
}