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
    var message_wrapper = {
        'channel': current_user_channel,
        'message': $('#message').val().trim(),
        'signature': username
    };
    $('#message').val('');
    setSelectionRange(document.getElementById('message'),0,0);
    socket.emit('chat message', message_wrapper);
}
function establishConnection(){
    socket = io.connect(""); 
}
function setSelectionRange(input, selectionStart, selectionEnd) {
    selectionStart  = selectionEnd = 0;
    if (input.setSelectionRange){
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    }else if (input.createTextRange){
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    }
}
