function gettyManager(data){
    var index = 0;
    for(var currentIteration = 0; currentIteration < channels.length;currentIteration++)
        setTimeout(function(){gettyImage(channels[index++]);}, 202 * currentIteration);
}
function gettyImage(keyword){
    if(keyword == undefined) return;
    if(keyword == false) return;
    $.ajax({
        url: 'https://api.gettyimages.com/v3/search/images?phrase=' + removeSpace(cutWord(keyword.trim())),
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Api-Key','wnuvy4sh9sc83xuvu67a6t7f');
        },
        success: function(data) {
            var uri = 'url("' + data.images[0].display_sizes[0].uri + '")'
            // console.log(keyword + " <- Assign image -> " + uri);
            document.getElementById(keyword).style.backgroundImage = uri
            document.getElementById(keyword).style.backgroundSize = 'cover';
        },
        error: function(data) {
            console.log("Error Getting-> " + keyword);
			gettyImage(keyword);
        }
    });
}
function removeSpace(input){
    if(input == null || input == undefined) return false;
    for(var x = 0;x < input.length;x++){
        if(input[x] == ' ') input = input.slice(0,x) + input.slice(x+1)
    }
    return input;
}
function cutWord(input){
    for(var x= 0 ; x < input.length;x++)if(input[x] == " ")return input.substr(0,x);return input;
}
