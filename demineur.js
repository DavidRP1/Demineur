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

var obtenirImageNumbre = function(x,y,tableauMines){
    // si c'est une mine, utilise image 9
    if(tableauMines[y][x] == true)
        return 9;
    
    //ce n'est pas une mine, donc
    //compter la numbre de mines autour de cette position
    var mines = 0;
    var positionX = [x - 1, x, x + 1];
    var positionY = [y - 1, y, y + 1];
    
    for(var i = 0 ; i < positionX.length; i++){
        for(var j = 0; j < positionY.length; j++){
            var posX = positionX[i];
            var posY = positionY[j];
            if(0 <= posX && posX < tableauMines[0].length
               && 0 <= posY && posY < tableauMines.length){
                mines = tableauMines[posY][posX] == true ? mines + 1 : mines;
            }
        }
    }
    return mines;
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
	
	var tuilesCachees = largeur*hauteur;

	
    while (true){ 
		
		if(tableauMines[positionClic.y][positionClic.x] == false){
            //Redessiner les champs
            var numbreImage = obtenirImageNumbre(positionClic.x, positionClic.y, tableauMines);
            
            if(numbreImage != 0){
                afficherImage(positionClic.x * 16, positionClic.y * 16, colormap, images[numbreImage]);
				if (tableauMines[positionClic.y][positionClic.x] != "devoilee"){
					tableauMines[positionClic.y][positionClic.x] = "devoilee"
					tuilesCachees--;
				}
			} else {
                //Si le joueur clique sur une tuile qui n’est pas une mine,
                //les tuiles directement voisines ne contiennent pas de mine,
                //alors les tuiles directement voisines sont devoilees en plus de la tuile cliquee
                var positionX = [positionClic.x - 1, positionClic.x, positionClic.x + 1];
                var positionY = [positionClic.y - 1, positionClic.y, positionClic.y + 1];
                for(var i = 0 ; i < positionX.length; i++){
                    for(var j = 0; j < positionY.length; j++){
                        var posX = positionX[i];
                        var posY = positionY[j];
                        if(0<=posX && posX<tableauMines[0].length
                           && 0<=posY && posY<tableauMines.length){
                            var numbreImage = obtenirImageNumbre(posX, posY, tableauMines);
                            afficherImage(posX * 16, posY * 16, colormap, images[numbreImage]);
							if (tableauMines[posY][posX] != "devoilee"){
								tableauMines[posY][posX] = "devoilee"
								tuilesCachees--;
							}
                        }
                    }
                }
            }
			if (tuilesCachees == nbMines){
				pause(0.01); // laisser le temps d'afficher l'image finale avant le message de victoire
				alert ("Vous avez gagne!");
				break;
			}
			
        } else {
            //si le joueur clique sur une mine
            //Redessiner le map
            for(var i = 0; i < tableauMines.length; i++){
                var rang = tableauMines[i];
                for(var j = 0; j < rang.length; j++){
                    if(tableauMines[i][j] == true) {
                        if(j == positionClic.x && i == positionClic.y){
                            //Dessiner la mine en rouge
                            afficherImage(j * 16, i * 16, colormap, images[10]);
                        } else {//Pour afficher les mines seulement
                            afficherImage(j * 16, i * 16, colormap, images[9]);
                        }
                    }
                }
            }
            pause(0.01); // laisser le temps d'afficher l'image finale avant le message d'echec
			alert ("Vous avez perdu!");
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
    
    return({x: coord[0], y: coord[1]});
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

   // assert (exportScreen(afficherImage(1,1,colormap,images[7])));
};


testDemineur();
