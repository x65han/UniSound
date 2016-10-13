function gettyManager(data){
    var iteration = Math.ceil(channels.length % 5);
    var index = 0;
    for(var currentIndex = 0;currentIndex < iteration;currentIndex++){
        setTimeout(function(){
            gettyImage(channels[index++]);
            gettyImage(channels[index++]);
            gettyImage(channels[index++]);
            gettyImage(channels[index++]);
            gettyImage(channels[index++]);
        }, 1001 * currentIndex);
    }
}
function gettyImage(keyword){
    if(keyword == undefined) return;
    keyword = removeSpace(keyword);
    if(keyword == false) return;
    $.ajax({
        url: 'https://api.gettyimages.com/v3/search/images?phrase=' + keyword,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Api-Key','wnuvy4sh9sc83xuvu67a6t7f');
        },
        success: function(data) {
            console.log(keyword);
            if(data.images[0] == undefined) return;
            var uri = data.images[0].display_sizes[0].uri;
            var temp = {};
            temp[keyword] = uri
            channelImages.push(temp);
            document.getElementById(keyword).style.backgroundImage = 'url("' + getImageURL(keyword) + '")'
            document.getElementById(keyword).style.backgroundSize = 'cover';
        }
    });
}
function getImageURL(keyword){
    for(var x = 0;x < channelImages.length;x++){
        var string = channelImages[x];
        for(var j in string)
            if(j.toLowerCase() == keyword.toLowerCase())return string[j];
    }return false;
}
function removeSpace(input){
    if(input == null || input == undefined) return false;
    for(var x = 0;x < input.length;x++){
        if(input[x] == ' ') input = input.slice(0,x) + input.slice(x+1)
    }
    return input;
}
