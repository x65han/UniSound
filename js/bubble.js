function isCanvasSupported(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}
var bubble = [];
var bubbleTimer,c,ctx,radius = 2.5,secondary = false;
function bubbleAnimation(){
    console.log('BUBBLE: =-=-=-=-=-=-=-=');
    //Setting up canvas
    c = document.getElementById("bubbleCanvas");
    c.width = document.getElementById("bubbleCanvas").offsetWidth;
    c.height = document.getElementById("bubbleCanvas").offsetHeight;
    ctx = c.getContext("2d");
    // Graphic constants
    this.fontSize = 70;
    this.density = 3;
    this.keyword = "What is your name :";
    //Triggering Main features
    this.start = function(){
        if(this.requirementCheck == false) return false;
        ctx.fillStyle = "red";
        ctx.font = this.fontSize + 'px Arial';
        ctx.textAlign="center";
        ctx.fillText(this.keyword, c.width/2, this.fontSize);
        this.processImage();
    }
    // Utility Functions
    this.processImage = function(){
        var imageData, pixel, height, width;

        imageData = ctx.getImageData(0, 0, c.width, c.height);

        // quickly iterate over all pixels - leaving density gaps
        for(height = 0; height < c.height; height += this.density){
            for(width = 0; width < c.width; width += this.density){
               pixel = imageData.data[((width + (height * c.width)) * 4) - 1];
                  //Pixel is black from being drawn on.
                  if(pixel == 255){
                      var temp = {
                          currentX: this.getRandomNumber(c.width),
                          currentY: this.getRandomNumber(c.height),
                          targetX: width,
                          targetY: height,
                          velocity: this.getRandomNumber(20),
                          color: this.getRandomColor()
                      }
                      bubble.push(temp);
                  }
            }
        }
        // set timer for drawing
        bubbleTimer = setInterval(draw,40);
    }
    this.getRandomColor = function() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    this.getRandomNumber = function(limit){
        return Math.floor((Math.random() * limit) + 1);
    }
    this.stop = function(){
        clearInterval(bubbleTimer);
    }
}
function draw(){
    var lap = 0;
    // clear canvas
    ctx.clearRect(0, 0, c.width, c.height);
    //update position
    for(var i = 0;i < bubble.length; i++){
        if(Math.abs(bubble[i].targetX - bubble[i].currentX) < (bubble[i].velocity + 1)){
            bubble[i].currentX = bubble[i].targetX;
            lap++;
        }
        else if(bubble[i].targetX > bubble[i].currentX) bubble[i].currentX += bubble[i].velocity;
        else if(bubble[i].targetX < bubble[i].currentX) bubble[i].currentX -= bubble[i].velocity;

        if(Math.abs(bubble[i].targetY - bubble[i].currentY) < (bubble[i].velocity + 1)){
             bubble[i].currentY = bubble[i].targetY;
             lap++;
        }
        else if(bubble[i].targetY > bubble[i].currentY) bubble[i].currentY += bubble[i].velocity;
        else if(bubble[i].targetY < bubble[i].currentY) bubble[i].currentY -= bubble[i].velocity;
        else if(bubble[i].currentY == bubble[i].targetY) lap++;
    }
    // check if done
    if(lap == bubble.length *2){
        if(secondary == false){
            setTimeout(function(){
                for(var z = 0;z < bubble.length; z++){
                    bubble[z].targetY = 0;
                    bubble[z].targetX = 0;
                }
                secondary = true;
                setTimeout(function(){
                    clearInterval(bubbleTimer);
                    $('.register-instruction').html('What is your name:');
                    $('#bubbleCanvas').addClass('hidden');
                }, 1000);
            }, 2000);
        }
    }
    // Draw the circle
    for(var x = 0;x < bubble.length; x++){
        ctx.fillStyle = bubble[x].color;
        ctx.beginPath();
        ctx.arc(bubble[x].currentX, bubble[x].currentY, radius ,0 , Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }
}
window.onresize = function(event) {
    clearInterval(bubbleTimer);
    $('.register-instruction').html('What is your name:');
    $('#bubbleCanvas').addClass('hidden');
};
