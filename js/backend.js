function applyMessageOnUI(messageData){
    console.log("applying message onUIIIUIUIUIUI: " + current_user_state);
    for(var message in messageData){
        if(messageData[message].sender == username)
            OutgoingBubble(messageData[message].detail);
        else
            IncomingBubble(messageData[message].detail, messageData[message].sender);
    }
}
function sendMessage(){
    if($('#message').val().trim() == '') return;
    console.log('sending message');
    var message_wrapper = {
        'channel': current_user_channel,
        'message': $('#message').val().trim(),
        'signature': username
    };
    $('.chat-dashboard').css('border-bottom-width','150px');
    setTimeout(function(){ $('.chat-dashboard').css('border-bottom-width','2px'); }, 120);
    $('#message').val('');
    socket.emit('register message', message_wrapper);
}
function establishConnection(){
    socket = io.connect("");
    socket.emit("request channels",username);
    socket.on('new message', function(data){
        if(data.channel != current_user_channel) return;
        console.log('scoket new message: ' + data.message);
        if(data.signature == username){OutgoingBubble(data.message);}
        else IncomingBubble(data.message, data.signature);
        showLatestMessage();
    });
    socket.on('force update', function(data){
        system(true, 'Reloading messages');
        current_user_state = 2;
        clearMessages();
        getAndLoadMessageFromChannel();
        current_user_state = 3;
    });
    socket.on('distribute channels', function(data){
        if(environmentSetup != 3){
            channels = data;
            environmentSetup++;
        }
    });
    socket.on('distribute channel message', function(data){
        if(environmentMessageReady == false)    applyMessageOnUI(data);
        environmentMessageReady = true;
    });
}
function getAndLoadMessageFromChannel(){//Navigate to according channel & grab specific channel detail
    socket.emit("request channel message",current_user_channel);
}
