// Raby-Pepin, David & Wang, Xiaoqian
// 05-11-2018
// Description du programme

////////////////////////////////////////////////////////////////////////////////
load("image.js");

var afficherImage = function(x, y, colormap, image){
    for(var i = 0; i <image.length; i++ ){
        var rang = image[i];
        for(var j = 0; j < rang.length; j++){
            var color = colormap[rang[j]];
            setPixel(j, i, color);
        }
    }
    
};


var attendreClic = function(){
};


var placerMines = function(largeur, hauteur, nbMines, x, y){
};


var demineur = function(largeur, hauteur, nbMines){
    
};


// tests unitaires de la procedure afficherImage et la fonction placerMines
var testDemineur = function(){
    setScreenMode(16, 16);
    afficherImage(1,1,colormap,images[7]);
};


testDemineur();






