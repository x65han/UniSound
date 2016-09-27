function applyMessageOnUI(messageData){
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
        if(data.length != channels.length){
            channels = data;
            environmentSetup++;
        }
    });
}
function getAndLoadMessageFromChannel(){//Navigate to according channel & grab specific channel detail
    ref.child(current_user_channel).on("value", function(snapshot){
        if(current_user_state == 2)    applyMessageOnUI(snapshot.val());
    },function(errorObject){
        console.log('cannot get messages from: ' + channelRequest);
    });
}

// function getAndLoadChannels(){
//     ref.on("value",function(snapshot){
//         if(environmentSetup >= 3) return;
//         channels_array = [];
//         for(var one in snapshot.val()) channels_array.push(one);
//         channels = channels_array;
//         environmentSetup++;
//         console.log('channels below: ' + channels);
//     },function(errorObject) {
//         console.log("The read failed: " + errorObject.code);
//     });
// }
