$("#adminloginpage").validate({
        
    rules:{
        email:{
            required:true
        },
        password:{
            required:true
        }
       
        
    },
    messages:{
        password:{
            required: 'Password is required'
        }
    }
  
});



$("#admincreatepage").validate({
    rules:{
        email:{
            required:true
        },
        password:{
            required:true,
            minlength:8
        },
        firstname:{
            required:true
        },
        lastname:{
            required:true
        },
        confirmpassword:{
            required:true
        }
       
        
    },
    messages:{
        password:{
            required: 'Password is required'
        }
    }
  
});

$("#edit").validate({
        
    rules:{
        firstname:{
            required:true
        },
        lastname:{
            required:true
        }
       
        
    }
});

$("#editbutton").click(function(){
    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire('Saved!', '', 'success')
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })
})