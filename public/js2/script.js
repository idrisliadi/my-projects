let updateBlogbuttons = document.querySelectorAll(".updatebtn")
updateBlogbuttons.forEach((el)=>{
    el.addEventListener("click",()=>{
        const blogId = el.getAttribute("data-id")
        console.log(blogId)
        $.ajax({
            method :"GET",
            url : `/update/${blogId}`,
            success : function(data){
           
                console.log($(`#forms`).html(data))
            }
          
        }) 
    })
})

