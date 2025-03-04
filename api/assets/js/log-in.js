$(".log-error-div").hide();
var baseurl = $(".base-url").val();


$("#log-submit").on("click",function(){
  
    if($("#log-email").val()=="" || $("#log-password").val()==""){
        $(".logIn-div input").addClass("border-danger");
    }
    else{
        let email = $("#log-email").val();
        
        let password = $("#log-password").val();
        $.ajax({
            url: baseurl + "LogInPage/log_data",
            type:"post",
            data:{
              'email' : email,
              'password':password},
                type:"post", 
                dataType:"json",
                success:function(data){
               if(data.status==200){
             window.location.href=baseurl+"All_Masters/dashboard";
               }
               else{
                $(".log-error-div").show();
               }
                }
        })
    }
})


