//configuration varible
var REST = window.location.href.slice(0, window.location.href.length - 1);
var ref = new Firebase("https://unisoundpower.firebaseio.com/channels");
var environmentSetup = 0;
var socket,
    current_user_state = 0,
    hard_code_style_length = 0,
    backgroundImageFlashingOrder = 0,
    channels_participation = [7,6,7,3,6,3,8,2,1],
    chat_environment_color,current_user_channel,username,rainbow, channels,channel = '';
//logic
function completeSetup(){
    applyZoneTravel(1);
    //Connect to socket io
    establishConnection();
    // Local UI setup
    colorChange();
    var backgroundImageFlashing = setInterval(function(){colorChange();}, 5000);
    applyCanvas();
    loadChannels(true);
}
window.onload = function(){
    getAndLoadChannels();
    $.get(REST + '/getRainbowColorArray', function(data) {rainbow = data;environmentSetup++;});
    $.get(REST + '/getChannelScript', function(data) {channel = data;environmentSetup++;});
    var checkingEnvironmentTimer = setInterval(function(){
        console.log('checking environment');
        if(environmentSetup >= 3){
            completeSetup();
            clearInterval(checkingEnvironmentTimer);
            console.log('Environment Setup Complete');
            console.log('==========================');
        }
    }, 10);
    //key stroke
    document.body.onkeydown = function(e) {
        var ev = e || event;var key = ev.keyCode;
        if(ev.keyCode == 13) {
            console.log('Enter Pressed');
            if(current_user_state == 1){
                userRequestZoneTravel(current_user_state,'random');
            }else if(current_user_state == 3){
                sendMessage();
            }
        }
   }
   document.getElementById('message').onkeydown = function(e) {
       var ev = e || event;var key = ev.keyCode;
       if(ev.keyCode == 13 && current_user_state == 3) {
            sendMessage();
        }
    }
};

function userRequestZoneTravel(current_zone, ele){
    //validation of travelling from
    if(current_zone == 1){
        if($('.username-input').val() == ''){
            system(true,'Name cannot be empty!');
            return;
        }else{
            username = $('.username-input').val();
            console.log('Username: ' + username);
            $('.username').html(username);
        }
    }else if(current_zone == 2){
        current_user_channel = ele.title;
        chat_environment_color = ele.id;
        system(true,current_user_channel);
        //Clear messages
        clearMessages();
        // load message
        getAndLoadMessageFromChannel();
    }else if(current_zone == 3){
        current_user_channel = '';
    }else{
        system(true,'Invalid Zone Travel');
        return;
    }
    //actions
    if(current_zone == 3) applyZoneTravel(2);
    else    applyZoneTravel(current_zone + 1);
}

//Ultility Functions
function applyZoneTravel(newState){
  $('.container-chat').addClass('hidden');
  $('.container-register').addClass('hidden');
  $('.container-channel').addClass('hidden');
  current_user_state = newState;
  console.log('Current State:' + newState);
  switch(newState) {
    case 1:
        $('.background-image').removeClass('hidden');
        $('.container-register').removeClass('hidden');
        $('.container-chat').css('transform','rotateY(180deg) rotateX(180deg)');
        $('.container-chat').css('width','0px');
        $('.container-chat').css('height','0px');
        var channel_avatar_array = document.getElementsByClassName('channel-avatar');
        setTimeout(function(){
          for(var x = 0;x < channels.length;x++)  channel_avatar_array[x].style.transform = "translateX(40px) translateY(-41px) rotate(180deg)";
        }, 10);
        break;
    case 2:
        $('.background-image').addClass('hidden');
        $('.container-channel').removeClass('hidden');
        $('.container-chat').css('transform','rotateY(180deg) rotateX(180deg)');
        $('.container-chat').css('width','0px');
        $('.container-chat').css('height','0px');
        var channel_avatar_array = document.getElementsByClassName('channel-avatar');
        setTimeout(function(){
          for(var x = 0;x < channels.length;x++)  channel_avatar_array[x].style.transform = "translateX(40px) translateY(-41px) rotate(0deg)";
        }, 50);
        break;
    case 3:
        // body background style
        document.body.style.backgroundColor = chat_environment_color;
        // style configuration
        $('.background-image').addClass('hidden');
        $('.container-chat').removeClass('hidden');
        $('.bubble-sub').css('color', chat_environment_color);
        $('.chat-window').css("color", chat_environment_color);
        document.getElementsByClassName('chat-topic-display')[0].innerHTML = current_user_channel;
        $('.chat-dashboard').css("color", chat_environment_color);
        $('.chat-dashboard').css("border-color", chat_environment_color);
        $('.chat-topic-display').css('border-bottom','2px dashed '+chat_environment_color);
        $('.chat-topic-display').css('color',chat_environment_color);
        //Set chatting environment
        setTimeout(function(){
            $('.container-chat').css('transform','rotateY(0deg) rotateX(0deg)');
            $('.container-chat').css('width','80vw');
            $('.container-chat').css('height','100vh');
            showLatestMessage();
        }, 50);

        //Reset channel color
        var channel_avatar_array = document.getElementsByClassName('channel-avatar');
        for(var x = 0;x < channels.length;x++)  channel_avatar_array[x].style.transform = "translateX(40px) translateY(-41px) rotate(180deg)";
        break;
    default:
        var message = 'Warning: internal system error';console.log(message);  alert(message);
        break;
    }
}

function colorChange(){
  $(".background-image").css('background-color',rainbow[backgroundImageFlashingOrder]);
  $(".register-instruction").css('color',rainbow[arrayIncrease(3)]);
  $(".username-input").css('background-color',rainbow[arrayIncrease(3)]);
  $(".username-input").css('color',rainbow[backgroundImageFlashingOrder]);
  $(".container-register-connection").css('border-top-color',rainbow[arrayIncrease(3)]);
  $(".username-input").css('border-left-color','#181818');
  $(".username-input").css('border-top-color' ,rainbow[arrayIncrease(4)]);
  $(".username-input").css('border-right-color',rainbow[arrayIncrease(5)]);
  $(".username-input").css('border-bottom-color',rainbow[arrayIncrease(5)]);
  backgroundImageFlashingOrder++;
  if(backgroundImageFlashingOrder == rainbow.length) backgroundImageFlashingOrder=0;
}
function arrayIncrease(increase){
    var temp = backgroundImageFlashingOrder + increase;
    if(temp > (rainbow.length-1)) return (temp - rainbow.length);
    else return temp
}

function applyCanvas(){
    var c = document.getElementById('next-button');
    var ctx = c.getContext("2d");
    //gradient color
    var r = c.width / 2;
    var grd = ctx.createLinearGradient(c.width/2,c.height/2,0,0,c.width/2);
    grd.addColorStop(0, "#2e3238");
    grd.addColorStop(1, "#181818");

    ctx.fillStyle = grd;
    //Initialize Triangle
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(c.width,0);
    ctx.lineTo(c.width / 2, c.height);
    ctx.fillstyle = arrayIncrease(3);
    ctx.fill();
}
function showSystemMessage(decision){
  if($('.system').width() > 0 && decision == true )return;
  else if(decision == false){
    $('.system').css('width','0px');
    setTimeout(function(){$('.system').addClass('hidden');}, 1000);
  }
  else if(decision == true){
      $('.system').removeClass('hidden');
      setTimeout(function(){$('.system').css('width','200px');}, 10);
      setTimeout(function(){$('.system').css('font-size','24px');}, 500);
      setTimeout(function(){showSystemMessage(false);$('.system').css('font-size','1px');}, 2000);
  }
}
function setSystemMessage(message){
  $('.system').html(message);
  $('.system').attr('title', message);
}
function system(decision,message){
  setSystemMessage(message);
  showSystemMessage(decision);
}
function loadChannels(decision){
    for(var x = 0; x < channels.length;x++){// Generate Channel Box
        var pre_existing_code = $('.channel-box').html();
        $('.channel-box').html(pre_existing_code + channel);
    }
    //Register generated Channels
    var channel_array = document.getElementsByClassName('channel');
    var channel_top_array = document.getElementsByClassName('channel-top');
    var channel_avatar_bottom_array = document.getElementsByClassName('channel-avatar-bottom');
    //Assign Attributes
    for(var i = 0; i < channels.length;i++){
        //Assign Details
        channel_top_array[i].innerHTML = channels[i] + channel_top_array[i].innerHTML;
        channel_array[i].title = channels[i];
        channel_avatar_bottom_array[i].innerHTML = channels_participation[i] + channel_avatar_bottom_array[i].innerHTML;
        // Assign Color
        channel_top_array[i].style.backgroundColor = rainbow[arrayIncrease(i)];
        channel_array[i].id = rainbow[arrayIncrease(i)];
        channel_avatar_bottom_array[i].style.backgroundColor = rainbow[arrayIncrease(i)];
    }
}
function OutgoingBubble(message){
    if(message.includes("&#") == false)
        var outgoingMessage = "<div class='bubble-container border'><div class='bubble outgoing rainbow highlightable'>" + message + "</div></div>";
    else {
        var outgoingMessage = "<div class='bubble-container border'><div class='bubble outgoing highlightable' style='font-size:50px;border:none;'>" + message + "</div></div>";
    }
    document.getElementsByClassName('chat-window')[0].innerHTML += outgoingMessage;
}
function IncomingBubble(message,author){
    if(message.includes("&#") == false)
        var incomingMessage = "<div class='bubble-container border'><div class='bubble incoming highlightable'>" + message + "</div><div class='bubble-sub'>- " + author + "</div> </div>";
    else
        var incomingMessage = "<div class='bubble-container border'><div class='bubble incoming highlightable' style='font-size:50px;'>" + message + "</div><div class='bubble-sub'>- " + author + "</div> </div>";
    document.getElementsByClassName('chat-window')[0].innerHTML += incomingMessage;
}
function showLatestMessage(){// show latest Message
    $('.chat-window').animate({scrollTop : document.getElementsByClassName('chat-window')[0].scrollHeight},900);
}
function clearMessages(){// clear all messages from channel
    $('.chat-window').html('');
}
