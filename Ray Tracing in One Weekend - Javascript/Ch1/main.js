var canvas = document.getElementById("c")
var $2 = canvas.getContext("2d")


var image = $2.createImageData(500,200)

var imageData = image.data



console.log(window.innerWidth+":"+window.innerHeight)

function resize(){
 canvas.width = window.innerWidth;
 canvas.height = window.innerHeight;
 draw()
}
resize()

function draw(){
 
for(var i=0;i<=image.width*image.height*4;)
{
    imageData[i]=0
    imageData[i+1]=0
    imageData[i+2]=0
    imageData[i+3]=255
    
    i=i+4
}

$2.fillRect(0,0,501,201)


for(var x=0;x<=image.width*4;x++){
    for(var y=0;y<=image.height;y++){
        var row = y
        var col = x 
        var width = image.width
        var scan = (col*width)+(row*4)

        imageData[scan]=0;
        imageData[scan+1]=255;
        imageData[scan+2]=0;
        imageData[scan+3]=255;
        
    }
}

$2.putImageData(image,0,0)
}

var pos = 0
var flip = 1
function animate(){
    $2.clearRect(0,0,canvas.width,canvas.height)
    resize()

    if(pos==400){
        flip = -1
    }

    if(pos==0){
        flip = 1
    }

    if(flip==1)
    {
        pos+=2
    }else{
        pos-=2
    }
    

    

    $2.fillStyle="#ff0000"
    $2.fillRect(pos,100,100,100)
 

    requestAnimationFrame(animate)
}

requestAnimationFrame(animate)



window.addEventListener("resize",resize);

