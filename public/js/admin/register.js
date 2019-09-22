$(()=>{
    
    $("#registerForm").submit(()=>{
        return false
    })

    $("#registerSubmitButton").click(()=>{
        
        var rrn = $("#rrn").val()
        if(rrn.length !== 12){
            alert("invalid rrn");
            return
        }

        var name = $("#name").val()
        if(name === ""){
            alert("please enter your name");
            return
        }


        var phone = $("#phonenumber").val()
        var phonePattern = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/i
        if(phone === "") {
            alert("Please enter your phone number");
            return
        }else if(!phone.match(phonePattern)){
            alert("phone number invalid");
            return
        }

        var event = $("#event").val()
        if(event === "-"){
            alert("Please select your Event");
            return
        }
        var email = $("#email").val()
        
        var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(email === "") {
            alert("Please enter your phone number");
            return
        }else if(!emailPattern.test(email)){
            alert("Email id invalid");
            return
        }

        var password = $("#password").val()
        if(password === "") {
            alert("Please enter the password");
            return
        }

        var confirmPassword = $("#confirm-password").val()
        if(confirmPassword === "") {
            alert("Please confirm your password");
            return
        }

        if(password !== confirmPassword){
            alert("Passwords do not match!");
            return
        }

        $("#buttonText").text("Registering...");
        $("#registerButtonSpinner").attr("hidden",false);
        $("#registerSubmitButton").attr("disabled",true);
        $.post("/admin/register",{
            rrn,name,phone,event,email,password,
        },(response)=>{
            console.log(response)
            if(response.success === false){
                alert(response.message);
                $("#buttonText").text("Register");
                $("#registerButtonSpinner").attr("hidden",true);
                $("#registerSubmitButton").attr("disabled",false);
                return
            }
            alert("Registeration successful, Please login to continue");
            window.location = "/admin/login"
        }).catch(()=>{
            alert("Error in registration, Please try again later!");
            $("#buttonText").text("Register");
            $("#registerButtonSpinner").attr("hidden",true);
            $("#registerSubmitButton").attr("disabled",false);
        })
        
    })

   
})