function loadMessage(){
  console.log('UI request message from channel: ' + current_user_channel);
  $.get(REST + '/getMessage/' + current_user_channel, function(data) {
      for(var message in data){
          console.log(data[message].detail + '  from: ' + data[message].sender);
          if(data[message].sender == username)
              OutgoingBubble(data[message].detail);
          else
              IncomingBubble(data[message].detail, data[message].sender);
      }
  });
}
function sendMessage(){
    console.log('sending message');
}
function establishConnection(){
    // var socket = io();
}
