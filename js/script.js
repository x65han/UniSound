//configuration varible
var space = ' ';
var firstname = 'Johnson';
var lastname = 'Han';
var current_user_state = 0;
var backgroundImageFlashingOrder = 0;
var rainbow = ['#EE6352','#E7386F','orangered','gold','#84DD63','#89FC00','#5ADBFF'];
var channels = ['Sports','Movie','Food','Finance','Politics','Travel','Cars','Shopping','Career'];
var channel  = "<div class='channel col-lg-4 col-md-4 col-sm-4 col-xs-4 border'><div class='channel-top'></div><div class='channel-bottom'><div class='channel-avatar'><div class='channel-avatar-top'></div><div class='channel-avatar-bottom'></div></div></div></div>"
//logic
window.onload = function(){
  $('.user-name').html(firstname + space + lastname);
  master_state_change(2);
  console.log('Ready');
  colorSwitch();
  var backgroundImageFlashing = setInterval(function(){
      colorSwitch();
	}, 5000);
  complete_canvas();
  loadChannel(true);
  //key stroke
  document.getElementsByTagName('body')[0].onkeydown = function(e) {
      var ev = e || event;
      var key = ev.keyCode;
      if(ev.keyCode == 13) {
        console.log('Enter Pressed');
        if(current_user_state == 1 || current_user_state == 2){
            zoneTravel(current_user_state);
        }
      }
   }
};

function zoneTravel(current_zone){
  //validation
  if(current_zone == 1){
    if($('.username-input').val() == ''){
        system(true,'Name cannot be empty!');
        return;
    }
  }else if(current_zone == 2){

  }
  else{
    system(true,'Invalid Zone Travel');
    return;
  }
  //actions
  current_zone++;
  if(current_zone > 3) current_zone -= 3;
  master_state_change(current_zone);
}
//Ultility Functions
function master_state_change(newState){
  if(current_user_state == newState) return;
  $('.container-chat').addClass('hidden');
  $('.container-register').addClass('hidden');
  $('.container-channel').addClass('hidden');
  current_user_state = newState;
  console.log('Current State:' + newState);
  switch(newState) {
    case 1:
        // $('.background-image').addClass('hidden');
        $('.container-register').removeClass('hidden');
        $('.container-chat').css('transform','rotateY(180deg) rotateX(180deg)');
        $('.container-chat').css('width','0px');
        $('.container-chat').css('height','0px');
        break;
    case 2:
        // $('.background-image').addClass('hidden');
        $('.container-channel').removeClass('hidden');
        $('.container-chat').css('transform','rotateY(180deg) rotateX(180deg)');
        $('.container-chat').css('width','0px');
        $('.container-chat').css('height','0px');
        break;
    case 3:
        // $('.background-image').removeClass('hidden');
        $('.container-chat').removeClass('hidden');
        setTimeout(function(){
            $('.container-chat').css('transform','rotateY(0deg) rotateX(0deg)');
            $('.container-chat').css('width','80vw');
            $('.container-chat').css('height','100vh');
        }, 50);
        break;
    default:
        var message = 'Warning: internal system error';console.log(message);  alert(message);
        break;
    }
}

function colorSwitch(){
  $(".background-image").css('background-color',rainbow[backgroundImageFlashingOrder]);
  $(".register-instruction").css('color',rainbow[arrayIncrease(3)]);
  $(".username-input").css('background-color',rainbow[arrayIncrease(3)]);
  $(".username-input").css('color',rainbow[backgroundImageFlashingOrder]);
  $(".container-register-connection").css('border-top-color',rainbow[arrayIncrease(3)]);
  $(".username-input").css('border-left-color',rainbow[arrayIncrease(3)]);
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

function complete_canvas(){
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
      setTimeout(function(){showSystemMessage(false);}, 2000);
  }
}
function setSystemMessage(message){
  $('.system').html(message);
}
function system(decision,message){
  setSystemMessage(message);
  showSystemMessage(decision);
}
function loadChannel(decision){
    for(var i = 0; i < channels.length;i++){
        var pre = $('.channel-box').html();
        $('.channel-box').html(pre + channel);
    }
    if(decision == true){
        var channel_array = document.getElementsByClassName('channel-top');
        var channel_array_carry = document.getElementsByClassName('channel-avatar-bottom');
        for(var x = 0; x < channel_array.length;x++){
            channel_array[x].style.backgroundColor = rainbow[arrayIncrease(x)];
            channel_array_carry[x].style.backgroundColor = rainbow[arrayIncrease(x)];
        }
    }
}
