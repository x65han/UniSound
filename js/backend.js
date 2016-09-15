function applyMessageOnUI(messageData){
    $('.chat-window').html('');
    console.log('Apply Messages on UI: ' + current_user_channel);
    for(var message in messageData){
        if(messageData[message].sender == username)
            OutgoingBubble(messageData[message].detail);
        else
            IncomingBubble(messageData[message].detail, messageData[message].sender);
    }
    showLatestMessage();
}
function sendMessage(){
    if($('#message').val().trim() == '') return;
    console.log('sending message');
    var message_wrapper = {
        'channel': current_user_channel,
        'message': $('#message').val().trim(),
        'signature': username
    };
    $('#message').val('');
    socket.emit('register message', message_wrapper);
}
function establishConnection(){
    socket = io.connect("");
}
function getAndLoadMessageFromChannel(){
    //Navigate to according channel & grab specific channel detail
    alert("getAndLoadMessageFromChannel");
    ref.child(current_user_channel).on("value", function(snapshot) {
        // console.log(snapshot.val());
        applyMessageOnUI(snapshot.val());
    }, function (errorObject) {
        console.log('cannot get messages from: ' + channelRequest);
    });
}

function getAndLoadChannels(){
    if(environmentSetup >= 3) return;
    ref.on("value", function(snapshot) {
        channels_array = [];
        for(var one in snapshot.val()) channels_array.push(one);
        channels = channels_array;
        environmentSetup++;
        console.log('channels below: ' + channels);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}
