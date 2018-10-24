// Raby-Pepin, David & Wang, Xiaoqian
// 05-11-2018
// Description du programme

////////////////////////////////////////////////////////////////////////////////

load("images.js");


var coordTuiles = function(coordX, coordY){
    coordX = Math.floor(coordX/16);
    coordY = Math.floor(coordY/16);
    return ([coordX, coordY]);
};


var demineur = function(largeur, hauteur, nbMines){
    setScreenMode(largeur*16, hauteur*16);
    
    //Dessiner intielement
    for(var i = 0; i < largeur; i++){
        for(var j = 0; j < hauteur; j++){
            afficherImage(i * 16, j * 16, colormap, images[11]);
        }
    }
    
    var positionClic = attendreClic();
    
    var tableauMines = placerMines(largeur, hauteur, nbMines, positionClic.x, positionClic.y);
    
    var tableauAfficher = [];
    
    //Pour construire le tableau d'afficher qui donner le numero d'image
    //tel que 0, 1,2,3,4,5,6,7,8,mine
    for(var i = 0; i < tableauMines.length; i++){
        var rang = tableauMines[i];
        var rangImage = [];
        for(var j = 0; j < rang.length; j++){
            // si c'est une mine, utilise image 9
            if (tableauMines[i][j] == true){
               // print("i, j", i, j); // a deleter plus tard
                rangImage.push(9);
                continue;
            }
            //ce n'est pas une mine, donc
            //compter la numbre de mines autour de cette position
            var mines = 0;
            if (j - 1 >= 0){
			    mines = tableauMines[i][j - 1] == true ? mines + 1 : mines;
			}
			if (j + 1 >= 0){
			    mines = tableauMines[i][j + 1] == true ? mines + 1 : mines;
			}
            if ( i - 1 >= 0){
                mines = tableauMines[i-1][j] == true ? mines + 1 : mines;
                if(j - 1 >= 0){
                    mines = tableauMines[i - 1][j - 1] == true ? mines + 1 : mines;
                }
                if(j + 1 < rang.length){
                    mines = tableauMines[i - 1][j + 1] == true ? mines + 1 : mines;
                }
            }
            if ( i + 1 < tableauMines.length){
                mines = tableauMines[i + 1][j] == true ? mines + 1 : mines;
                if(j + 1 < rang.length){
                    mines = tableauMines[i + 1][j + 1] == true ? mines + 1 : mines;
                }
                if(j - 1 >= 0){
                    mines = tableauMines[i + 1][j - 1] == true ? mines + 1 : mines;
                }
            }
            rangImage.push(mines);
        }
        tableauAfficher.push(rangImage);
    }
    
    
    
    // a complete
    var fini = false;
    while (!fini){
        if(tableauMines[positionClic.y][positionClic.x] == false){
            //Redessiner les champs
            afficherImage(positionClic.x * 16, positionClic.y * 16, colormap, images[tableauAfficher[positionClic.y][positionClic.x]]);
            
        } else {
            fini = true;
            //Redesiner le map
            for(var i = 0; i < tableauAfficher.length; i++){
                var rang = tableauAfficher[i];
                for(var j = 0; j < rang.length; j++){
                    afficherImage(j * 16, i * 16, colormap, images[tableauAfficher[i][j]]);
                }
            }
            break;
        }
        
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
    
    var coord = coordTuiles(getMouse().x, getMouse().y);
    
    return({x: coord[0], y: coord[1]})
};



var placerMines = function(largeur, hauteur, nbMines, x, y){
    
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
     
        tableauMines[coordClic[1]][coordClic[0]] = false; 
    }
        
    return (tableauMines);
};




var afficherImage = function(x, y, colormap, image){
    for(var i = 0; i <image.length; i++ ){
        var rang = image[i];
        for(var j = 0; j < rang.length; j++){
            var color = colormap[rang[j]];
            setPixel(x+j, y+i, color);
        }
    }
};




// tests unitaires de la procedure afficherImage et la fonction placerMines
var testDemineur = function(){
    demineur(5,3,3);
    //afficherImage(1,1,colormap,images[7]);
};


testDemineur();
