//configuration varible
var firstname = 'Johnson';
var lastname = 'Han';
var space = ' ';
var current_user_state = 0;
var rainbow = ['#EE6352','#E7386F','orangered','gold','#84DD63','#89FC00','#5ADBFF'];
var backgroundImageFlashingOrder = 0;
//logic
window.onload = function(){
  $('.user-name').html(firstname + space + lastname);
  master_state_change(1);
  console.log('Ready');
  colorSwitch();
  var backgroundImageFlashing = setInterval(function(){
      colorSwitch();
	}, 5000);
  complete_canvas();
};

function zoneTravel(current_zone){
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
        break;
    case 2:
        // $('.background-image').addClass('hidden');
        $('.container-channel').removeClass('hidden');
        $('.container-chat').css('transform','rotateY(180deg) rotateX(180deg)');
        break;
    case 3:
        // $('.background-image').removeClass('hidden');
        $('.container-chat').removeClass('hidden');
        setTimeout(function(){$('.container-chat').css('transform','rotateY(0deg) rotateX(0deg)'); }, 50);
        break;
    default:
        var message = 'Warning: internal system error';console.log(message);  alert(message);
        break;
    }
}

function colorSwitch(){
  $(".background-image").css('background-color',rainbow[backgroundImageFlashingOrder]);
  $(".register-instruction").css('color',rainbow[arrayIncrease(3)]);
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
