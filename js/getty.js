var gettyVirgin = true;
function gettyManager(data){
    var index = 0;
    for(var currentIteration = 0; currentIteration < channels.length;currentIteration++)
        setTimeout(function(){gettyImage(channels[index++]);}, 201 * currentIteration);
    if(gettyVirgin == true || gettyVirgin == false)
        setTimeout(function(){gettyManager(channels);}, 1100 * channels.length);
    if(gettyVirgin == true) gettyVirgin = false;
    if(gettyVirgin == false) gettyVirgin = null;
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
