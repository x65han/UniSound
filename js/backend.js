function applyMessageOnUI(messageData){
    console.log("applying message onUIIIUIUIUIUI: " + current_user_state);
    for(var message in messageData){
        if(messageData[message].sender == username)
            OutgoingBubble(false,messageData[message].detail);
        else
            IncomingBubble(false,messageData[message].detail, messageData[message].sender);
    }
    setTimeout(function(){ showLatestMessage(); }, 500);
}
function sendMessage(){
    console.log('Checking requirements before sending');
    if($('#message').val().trim() == '')return;
    if(hackerWatch < 0.5){
        system(true, "Too Fast");$('#message').val('');return;
    }
    console.log('sending message');
    var message_wrapper = {
        'message': $('#message').val().trim(),
        'signature': username
    };
    $('.chat-dashboard').css('border-bottom-width','150px');
    setTimeout(function(){ $('.chat-dashboard').css('border-bottom-width','2px'); }, 120);
    $('#message').val('');
    socket.emit('register message', message_wrapper);
    hackerWatch = 0;
}
function establishConnection(){
    socket = io.connect("");
    socket.emit("request channels", username);
    socket.on('new message', function(data){
        console.log('SOCKET Received new message from:  ' + data.signature + " in channel: " + data.channel);
        console.log("Message Detail: " + data.message);
        if(data.signature == username){OutgoingBubble(true,data.message);}
        else IncomingBubble(true,data.message, data.signature);
        showLatestMessage();
    });
    socket.on('force update', function(data){
        alert('Force update failed');
        if(current_user_state == 3){
            system(true, 'Reloading messages');
            current_user_state = 2;
            clearMessages();
            environmentMessageReady = false;
            getAndLoadMessageFromChannel();
            current_user_state = 3;
        }
    });
    socket.on('distribute channels', function(data){
        if(environmentSetup != 3){
            channels = data;
            environmentSetup++;
            gettyManager(channels);
        }
    });
    socket.on('distribute channel message', function(data){
        if(environmentMessageReady == false)    applyMessageOnUI(data);
        environmentMessageReady = true;
    });
}

function registerUserWithServer(username){
    socket.emit('register user', username, function(response){
        sanityCheckUsername = response;
        console.log(response);
        if(response == false){
            alert("Username Exist & please try a different Username");
            clearInterval(sanityCheckTimer);
            $('.username-input').val('');
        }
    });
}
function getAndLoadMessageFromChannel(){//Navigate to according channel & grab specific channel detail
    socket.emit("request channel message",current_user_channel);
}
function createNewChannel(newChannelName){
    console.log("Request New Channel: " + newChannelName);
    if(newChannelName == null || newChannelName == undefined || newChannelName =="" || typeof newChannelName != typeof "z"){
        return;
    }
    if(channels.indexOf(newChannelName) == -1){
        socket.emit("create new channel", newChannelName);
        channels.push(newChannelName);
        loadChannels(true);
        return;
    }
    console.log("Channels Exists: " + newChannelName);
}
