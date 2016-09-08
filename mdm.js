var selected_user = -1;
var num_users = 0;
var users = [];

// Called by MDM to disable user input
function mdm_disable() {
    $('#entry').prop("disabled", true);
    $('#ok_button').prop("disabled", true);
    $('#login-box').css('cursor', 'progress');
    $('#entry').css('cursor', 'progress');
    $('#ok_button').css('cursor', 'progress');
    $('#entrybox').hide();
    $('#animbox').show();
    animate();
}

// Called by MDM to enable user input
function mdm_enable() {
    $('#entry').prop("disabled", false);
    $('#ok_button').prop("disabled", false);
    $('#login-box').css('cursor', 'default');
    $('#entry').css('cursor', 'text');
    $('#ok_button').css('cursor', 'default');
    $('#entrybox').show();
    $('#animbox').hide();
    stopAnimate();
}

// Called by MDM to set the welcome message
function set_welcome_message(message) {         
    //document.getElementById("welcome_message").innerHTML = message;
}

// Called by MDM to update the clock
function set_clock(message) {           
    document.getElementById("clock").innerHTML = message;
}

// Called by MDM to allow the user to input a username      
function mdm_prompt(message) {  
    mdm_enable();
    document.getElementById("current_username").innerHTML = login_label;
    //document.getElementById("current_status").innerHTML = enter_your_username_label;
    //mdm_msg(message);
    document.getElementById("current_avatar").src = "img/drawing.png";

    for (var i=0;i<num_users;i++) {
        $('#user' + i).appendTo('#top_users');
        $('#user' + i).show();
    }
    document.getElementById("entry").value = "";
    document.getElementById("entry").type = "text";
    document.getElementById("entry").focus();
    selected_user = -1;         
}

// Called by MDM to allow the user to input a password
function mdm_noecho(message) {  
    mdm_enable();
    document.getElementById("entry").value = "";
    document.getElementById("entry").type = "password";
    document.getElementById("entry").focus();
}

// Called by MDM to show a message (usually "Please enter your username")
function mdm_msg(message) {
	$("#message").fadeOut(function(){  
		document.getElementById("message").innerHTML = message; 
	})
    $("#message").fadeIn();
}

// Called by MDM to show a timed login countdown
function mdm_timed(message) {
    if (message != "") {
        document.getElementById("timed").style.display = 'block';
    }
    else {
        document.getElementById("timed").style.display = 'none';
    }           
    document.getElementById("timed").innerHTML = message;           
}

// Called by MDM to show an error       
function mdm_error(message) {                       
    if (message != "") {
        document.getElementById("error").style.display = 'block';
    }
    else {
        document.getElementById("error").style.display = 'none';
    }
    document.getElementById("error").innerHTML = message;
}   

// Called by MDM to add a user to the list of users
function mdm_add_user(username, gecos, status, avatar) {
	
	
	users.push([username, gecos, status, avatar]);
    var top_users = document.getElementById("top_users");
    var link = document.createElement("div");0
    //link.setAttribute('id', 'user_'+num_users);
    link.id = 'user_'+num_users;
    $(link).addClass("userx");
    $(link).click(function(){alert('USER###'+username); mdm_set_current_user(username)});
    
    var dp = document.createElement("div");
    $(dp).addClass('dp');
            
    var im = document.createElement("img");
    $(im).addClass('class', 'img img-responsive img-circle col-xs-12');
    im.src = avatar;
    
    dp.appendChild(im)
	
	var gec = document.createElement("div");
	$(gec).addClass("nondp");
	
	var p1 = document.createElement("p");
	p1.id = "user_col";
	p1.innerHTML = "<span>"+gecos+"</span> <span>"+username+"</span>"
	
	var p2 = document.createElement("p");
	p2.id = "stat";
	p2.innerHTML = status;
	
	gec.appendChild(p1);
	gec.appendChild(p2);
	
	link.appendChild(dp);
	link.appendChild(gec);
    top_users.appendChild(link);

    num_users = num_users + 1;             
}   

// Called by MDM to add a session to the list of sessions
function mdm_add_session(session_name, session_file) {
    
    session_name = session_name.replace("Ubuntu", "Unity");
    
    var filename = session_file.toLowerCase();
    filename = filename.replace(/ /g, "-");
    filename = filename.replace(/\(/g, "");
    filename = filename.replace(/\)/g, "");
    filename = filename.replace(/\)/g, "");
    filename = filename.replace(/.desktop/g, "");
                             
                        
    
    var argon = document.getElementById("sessions");
    
    var ses = document.createElement("a");
    ses.href = "javascript:alert('SESSION###"+session_name+"###"+session_file+"');mdm_set_current_session('"+session_name+"','"+session_file+"');";
	ses.innerHTML = session_name;
    
    argon.appendChild(ses)
    
}       

// Called by MDM to get the full path of a language flag file
function mdm_get_language_flag_filepath(language_code) {
   
   var filename = language_code.toLowerCase();
   filename = filename.replace(".utf-8", "");
   var bits = filename.split("_");

   // Check for minority languages that have a flag.
   // For example: Catalan's language code can be ca or ca_es or ca_fr, Welsh's cy or cy_gb...
   if (filename === "ca" || bits[0] === "ca") {
       filename = "_Catalonia";
   } else if (filename === "cy" || bits[0] === "cy") {
       filename = "_Wales";
   } else if (filename === "eu" || bits[0] === "eu") {
       filename = "_Basque Country";
   } else if (filename === "gd" || bits[0] === "gd") {
       filename = "_Scotland";
   } else if (filename === "gl" || bits[0] === "gl") {
       filename = "_Galicia";
   } else if (filename === "sco" || bits[0] === "sco") {
       filename = "_Scotland";
   // Use the country code part of the language code (if it's available). For example: en_AU -> au.
   } else if (bits.length === 2) {
       filename = bits[1];
   }

   return "../common/img/languages/"+filename+".png";
}

// Called by MDM to add a language to the list of languages
function mdm_add_language(language_name, language_code) {
    
    var langs = document.getElementById("languages");
    
    var link = document.createElement("a");
    link.setAttribute("class", "lang");
    link.href = "javascript:alert('LANGUAGE###"+language_code+"'); mdm_set_current_language('"+language_name+"','"+language_code+"');";
    link.innerHTML = language_name;
    
    langs.appendChild(link);
    
}

function mdm_set_current_language(language_name, language_code) {
   /* document.getElementById("current_language_flag").src = mdm_get_language_flag_filepath(language_code);
    document.getElementById("current_language_flag").title = language_name;
    document.getElementById("current_language_flag").width = 16;
    $('#current_language_flag').popover('hide');
    */
    x=document.getElementById("langname");
    x.innerHTML = language_name;
}

function mdm_set_current_session(session_name, session_file)    {
    var filename = session_file.toLowerCase();
    filename = filename.replace(/ /g, "-");
    filename = filename.replace(/\(/g, "");
    filename = filename.replace(/\)/g, "");
    filename = filename.replace(/.desktop/g, "");
    
    /*
    document.getElementById("current_session_picture").src = "../common/img/sessions/"+filename+".svg";
    document.getElementById("current_session_picture").title = session_name;
    document.getElementById("current_session_picture").width = 16;
    $('#current_session_picture').popover('hide');
    */
    document.getElementById("sesname").innerHTML = session_name;
    
}

function mdm_set_current_user(username) {
	//[username, gecos, status, avatar]
	for(var i=0; i<num_users; i++){
		var user = users[i];
		if(user[0] == username){
			break;
		} else {
			user = null;
		}
	}
	
	if(user!=null){
		document.getElementById("current_gecos").innerHTML = user[1];
		document.getElementById("current_username").innerHTML = user[0];
		document.getElementById("current_avatar").src = user[3];
		mdm_msg(enter_your_password_label);
	}
}


function select_user_at_index(index, alert_mdm) {                   

    var index_to_select = index;
    if (index_to_select < 0) {
        index_to_select = num_users - 1;
    }
    if (index_to_select >= num_users) {
        index_to_select = 0;
    }
    
    var username = null;

    for (var i=0;i<num_users;i++) {
        if (i < index_to_select) {
            $('#user' + i).appendTo('#top_users');
        }
        else if  (i == index_to_select) {
            var user = document.getElementById("user" + i);
            var selected_status = document.getElementById("selected_status");                   
            username = user.username;
            if (user.current_status != "") {
                selected_status.innerHTML = user.current_status;
            }
            else {
                selected_status.innerHTML = enter_your_password_label;
            }
            var picture = document.getElementById('selected_avatar');               
            picture.setAttribute('src', "file://"+user.avatar);
            $('#user' + i).appendTo('#selected_user');
        }
        else {
            $('#user' + i).appendTo('#bottom_users');
        }   
        selected_user = index_to_select;
    }           

    if (alert_mdm) {
        alert('USER###'+ username);
    }
}       

// Called by MDM if the SHUTDOWN command shouldn't appear in the greeter
function mdm_hide_shutdown() {
    document.getElementById("shutdown").style.display = 'none';
}   

// Called by MDM if the SUSPEND command shouldn't appear in the greeter
function mdm_hide_suspend() {
    document.getElementById("suspend").style.display = 'none';
}

// Called by MDM if the RESTART command shouldn't appear in the greeter
function mdm_hide_restart() {
    document.getElementById("restart").style.display = 'none';
}

// Called by MDM if the QUIT command shouldn't appear in the greeter
function mdm_hide_quit() {
    document.getElementById("quit").style.display = 'none';
}

// Called by MDM if the XDMCP command shouldn't appear in the greeter
function mdm_hide_xdmcp() {
    document.getElementById("xdmcp").style.display = 'none';
}               

function Shutdown(){
	alert('FORCE-SHUTDOWN###');
}

function Suspend(){
	alert('FORCE-SUSPEND###');
}

function Restart(){
	alert('FORCE-RESTART###');
}



function DivToggle(id, effect){
	var v=$('#'+id).attr('data-state');
	if(v=="off"){
		switch(effect){
			case 'fade':
				$('#'+id).fadeOut('fast');
				break;
			case 'slide':
				$('#'+id).slideDown('fast');
				break
			default:
				$('#'+id).slideDown('fast');
				break;

		}

		$('#'+id).attr('data-state', 'on');
	}
	else {
			switch(effect){
			case 'fade':
				$('#'+id).fadeIn('fast');
				break;
			case 'slide':
				$('#'+id).slideUp('fast');
				break
			default:
				$('#'+id).slideUp('fast');
				break;

		}
		$('#'+id).attr('data-state', 'off');

	}
}


function DivOff(id, fx){
	x = document.getElementById(id);
	if(x.style.none!="none"){
		switch(fx){
			case 'fade':
				$('#'+id).fadeOut('fast');
				break;
			case 'slide':
				$('#'+id).slideDown('fast');
				break
			default:
				$('#'+id).slideUp('fast');
				break;
		}
		
		$('#'+id).attr('data-state', 'off');
	}

}
