$(document).on("click",".email",function(){
    
let id= $(this).attr("id");
console.log(id);
$.ajax({
    url: baseurl + "Invoice_crudOperations/download_pdf",
    type:"post",
    data:{
        id:id},
    
    success:function(data){
        
    }
})

});




  // open email model...........
  $(document).on("click",".email",function(){

    $("#invoice_no_for_pdf").val($(this).data('id')); 
    $("#recipient-name").val($(this).data('email')); 
    console.log($(this).data('email'));
    
   })
   
   // for sending mail.................
  function mail_send(){

    let emaildata = new FormData(email_form);
   
    var pdf_Path = `${baseurl}invoice_files/${$("#invoice_no_for_pdf").val()}.pdf`
  emaildata.append("pdf_path" , pdf_Path);
  
    $.ajax({
      url: baseurl + "EmailController/send_mail",
      data:emaildata,
      type:"post",
      processData: false,
      contentType: false,
      dataType: "json",
      beforeSend:function(){
       $(".mail-btn").html(`<button class="btn btn-primary" type="button" disabled>
  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...
  </button>`);
      },
      success: function(data){
        if (data.success!=''){
          $("#close").trigger("click");
          Swal.fire({
            title: "sent email!",
            text: "mail successfully sent",
            icon: "success",
           
          });
     
        $("#email-model-form").trigger("reset");
        $(".mail-btn").html(`<button type="button" onclick='mail_send()' class="btn btn-primary" id="send_email">Send message</button>`);
        
        } else if(data.error !="") {
          Swal.fire({
            title: "Not sent",
            text: "something wrong",
            icon: "warning"
          });
        
        }
      },
  
    })
  }
  

   
   
   
   