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
        var year = $("#year").val()
        if(year === "-") {
            alert("please select your year");
            return
        }
        var section = $("#section").val()
        if(section === "-") {
            alert("please section your section");
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
        var email = $("#email").val()
        console.log(email)
        var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(email === "") {
            alert("Please enter your phone number");
            return
        }else if(!emailPattern.test(email)){
            alert("Email id invalid");
            return
        }

        $("#buttonText").text("Registering...");
        $("#registerButtonSpinner").attr("hidden",false);
        $("#registerSubmitButton").attr("disabled",true);
        $.post("/register",{
            rrn,name,year,section,phone,email
        },(response)=>{
            console.log(response)
            if(response.success === false){
                alert(response.message);
                $("#buttonText").text("Register");
                $("#registerButtonSpinner").attr("hidden",true);
                $("#registerSubmitButton").attr("disabled",false);
                return
            }
            alert("Registeration successful");
            window.location = "/login"
        }).catch(()=>{
            alert("Error in registration, Please try again later!");
            $("#buttonText").text("Register");
            $("#registerButtonSpinner").attr("hidden",true);
            $("#registerSubmitButton").attr("disabled",false);
        })
        
    })

   
})