// Raby-Pepin, David & Wang, Xiaoqian
// 05-11-2018
// Description du programme

////////////////////////////////////////////////////////////////////////////////

load("image.js");

var demineur = function(largeur, hauteur, nbMines){
    setScreenMode(largeur*16, hauteur*16);
    
    var positionClic = attendreClic();
    
    placerMines(largeur, hauteur, nbMines, positionClic.x, positionClic.y);
    
    // a complete
    while (/reste des tuiles/){
        afficherImage(x, y, colormap, image)
        positionClic = attendreClic();
    }
    
};


var attendreClic = function(){
    var clic = getMouse().down;
    
    while (clic == true){
        pause(0.01);
        clic = getMouse().down;
    }
    
    while (clic == false){
        pause(0.01);
        clic = getMouse().down;
    }
    
    return({x: getMouse().x, y: getMouse().y})
};



var placerMines = function(largeur, hauteur, nbMines, x, y){
    
    // tranformation des coordonnees du premier clic en nombre de tuiles au
    // lieu du nombre de pixels
    
    x = Math.floor(x/16);
    y = Math.floor(y/16);
    var coordClic = [x,y];
    
    var rangeeMines = [];
    var tableauMines = [];
    

    if (nbMines < ((hauteur*largeur)-1)){
        
        for (var i=0; i<hauteur; i++){
            for (var j=0; j<largeur; j++){
            rangeeMines.push(false);
            }

            tableauMines.push(rangeeMines);
            rangeeMines = [];
        }
        
        var k=0;
        while (k < nbMines){
            var xMine = Math.floor(Math.random()*largeur);
            var yMine = Math.floor(Math.random()*hauteur);
            var coordMine = [xMine, yMine];

            if ((tableauMines[yMine][xMine] == false) && ((coordClic+"") != (coordMine+""))){
                tableauMines[yMine][xMine] = true;
                k++;
            }
        }
    } else if (nbMines == ((hauteur*largeur)-1)){
        
        for (var i=0; i<hauteur; i++){
            for (var j=0; j<largeur; j++){
            rangeeMines.push(true);
            }

            tableauMines.push(rangeeMines);
            rangeeMines = [];
        }
     
        tableauMines[y][x] = false; 
    }
        
    return (tableauMines);
};




var afficherImage = function(x, y, colormap, image){
    for(var i = 0; i <image.length; i++ ){
        var rang = image[i];
        for(var j = 0; j < rang.length; j++){
            var color = colormap[rang[j]];
            setPixel(j, i, color);
        }
    }
};




// tests unitaires de la procedure afficherImage et la fonction placerMines
var testDemineur = function(){
    setScreenMode(16, 16);
    afficherImage(1,1,colormap,images[7]);
};


testDemineur();

