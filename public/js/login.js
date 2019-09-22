$(()=>{

    $("#loginForm").submit(()=>{
        return false
    })

    $("#loginSubmitButton").click(()=>{
        var rrn = $("#rrn").val()
        if(rrn.length !== 12){
            alert("invalid rrn");
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
        $("#buttonText").text("Logging you in...");
        $("#loginButtonSpinner").attr("hidden",false);
        $("#loginSubmitButton").attr("disabled",true);
        $.post("/login",{
            rrn,phone
        },(response)=>{
            console.log(response)
            if(response.success === false){
                alert(response.message);
                $("#buttonText").text("Login");
                $("#loginButtonSpinner").attr("hidden",true);
                $("#loginSubmitButton").attr("disabled",false);
                return
            }
            window.location = "/"
        }).catch(()=>{
            alert("Error in Login, Please try again later!");
            $("#buttonText").text("Login");
            $("#loginButtonSpinner").attr("hidden",true);
            $("#loginSubmitButton").attr("disabled",false);
        })


    })

})