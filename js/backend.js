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
    var processedMessage = processEmoticon();
    var message_wrapper = {
        'channel': current_user_channel,
        'message': processedMessage.trim(),
        'signature': username
    };
    $('#message').val('');
    socket.emit('register message', message_wrapper);
}
function processEmoticon(){
    var trimmed = $('#message').val().trim();
    var happyFace = trimmed.replace(":)", "&#128512;   ");
    var sadFace = happyFace.replace(":(","&#128546;   ");
    var winkler = sadFace.replace(";)","&#128521;   ");
    return winkler;
}
function establishConnection(){
    socket = io.connect("");
    socket.on('new message', function(data){
        if(data.channel != current_user_channel) return;
        console.log('scoket new message: ' + data.message);
        if(data.signature == username){OutgoingBubble(data.message);}
        else IncomingBubble(data.message, data.signature);
        showLatestMessage();
    });
}
function getAndLoadMessageFromChannel(){//Navigate to according channel & grab specific channel detail
    ref.child(current_user_channel).on("value", function(snapshot){
        if(current_user_state == 2)    applyMessageOnUI(snapshot.val());
    },function(errorObject){
        console.log('cannot get messages from: ' + channelRequest);
    });
}

function getAndLoadChannels(){
    ref.on("value",function(snapshot){
        if(environmentSetup >= 3) return;
        channels_array = [];
        for(var one in snapshot.val()) channels_array.push(one);
        channels = channels_array;
        environmentSetup++;
        console.log('channels below: ' + channels);
    },function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}
