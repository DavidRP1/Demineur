// Raby-Pepin, David & Wang, Xiaoqian
// 05-11-2018
// Ce programme est un petit jeu graphique qui est une variante simplifiee du 
// jeu de demineur. Le joueur peut commencer une partie en appelant la fonction
// "demineur" et en indiquant en parametres d'entree le nombre de tuiles 
// desirees en largeur et en hauteur ainsi que le nombre de mines a placer.

////////////////////////////////////////////////////////////////////////////////



// importer le fichier images.js
load("images.js");



// procedure principale qui s’occupe du deroulement du jeu en temps reel
var demineur = function(largeur, hauteur, nbMines){
    
	// verifie que les parametres en entree sont valides
    var condLargeur = (largeur>0 && largeur===+largeur);
	var condHauteur = (hauteur>0 && hauteur===+hauteur);
	var condMines = (nbMines>=0 && nbMines<largeur*hauteur 
					&& nbMines===+nbMines);
	
	// si les parametres sont invalides, le joueur est informe et 
	// le jeu ne demarre pas
    if (!condLargeur || !condHauteur || !condMines){
		alert ("Veuillez entrer des parametres valides!");
		return;
	}
	
	// la taille de l'ecran est ajustee selon les parametres entres
	setScreenMode(largeur*16, hauteur*16);
    
    // affiche intialement toutes les tuiles comme non-devoilees 
    for(var i = 0; i < largeur; i++){
        for(var j = 0; j < hauteur; j++){
            afficherImage(i * 16, j * 16, colormap, images[11]);
        }
    }
    
	
	// enregistre la position de la premiere tuile cliquee par le joueur
    var posClic = attendreClic(); 
    
	// definie l'emplacement des mines dans le jeu
    var tabMines = placerMines(largeur, hauteur, nbMines, posClic.x, posClic.y);
	
	// compte du nombre de tuiles encore non-devoilees
	var tuilesCachees = largeur*hauteur;

	
	// boucle perpetuelle qui execute le jeu en temps reel
    while (true){ 
		
		// si le joueur clique sur une tuile vide (sans mine), affiche l'image 
		// appropriee a cet emplacement
		if(tabMines[posClic.y][posClic.x] != true){
			
            // obtient le numero de l'image appropriee
            var numImage = obtNumImage(posClic.x, posClic.y, tabMines);
            
			// s'il y a au moins une mine adjacente a la tuile cliquee, devoile
			// seulement cette tuile
            if(numImage != 0){
                afficherImage(posClic.x * 16, posClic.y * 16, colormap, 
				images[numImage]);
				
				// garde le compte du nombre de mines encore cachees
				if (tabMines[posClic.y][posClic.x] != "devoilee"){
					tabMines[posClic.y][posClic.x] = "devoilee";
					tuilesCachees--;
				}
			
			// si les tuiles adjacentes ne contiennent pas de mine, devoile
            // les tuiles adjacentes egalement
			} else {
               
                var positionX = [posClic.x - 1, posClic.x, posClic.x + 1];
                var positionY = [posClic.y - 1, posClic.y, posClic.y + 1];
				
                for(var i = 0 ; i < positionX.length; i++){
                    for(var j = 0; j < positionY.length; j++){
                        var posX = positionX[i];
                        var posY = positionY[j];
                        if(0<=posX && posX<tabMines[0].length
                           && 0<=posY && posY<tabMines.length){
                            var numImage = obtNumImage(posX, posY, tabMines);
                            afficherImage(posX * 16, posY * 16, colormap, 
							images[numImage]);
							
							// garde le compte du nombre de mines cachees
							if (tabMines[posY][posX] != "devoilee"){
								tabMines[posY][posX] = "devoilee";
								tuilesCachees--;
							}
                        }
                    }
                }
            }
			
			// si toutes les tuiles sans mine sont devoilees, le joueur gagne
			if (tuilesCachees == nbMines){
                pause(0.01); 
				alert ("Vous avez gagne!");
				break;
			}
			
			
		// si le joueur clique sur une mine, il perd 
        } else {
			
			// affiche la mine cliquee en rouge et devoile le reste des mines
            for(var i = 0; i < tabMines.length; i++){
                var rang = tabMines[i];
                for(var j = 0; j < rang.length; j++){
                    if(tabMines[i][j] == true) {
                        if(j == posClic.x && i == posClic.y){
                            afficherImage(j * 16, i * 16, colormap, images[10]);
                        } else {
                            afficherImage(j * 16, i * 16, colormap, images[9]);
                        }
                    }
                }
            }
			
			// affiche un message d'echec
            pause(0.01);
			alert ("Vous avez perdu!");
			break;
        }
        
		// la position de la derniere tuile cliquee par le joueur est mis a jour
        posClic = attendreClic();

    }
    
};



// fonction qui attend que le bouton de la souris soit relache, puis appuye
// avant de retourner la position de la tuile cliquee
var attendreClic = function(){
	
    var clic = getMouse().down; // verifie si le bouton de la souris est appuye
    
	// attend que le bouton de la souris soit relache
    while (clic == true){
        pause(0.01);
        clic = getMouse().down;
    }
    
	// attend que le bouton de la souris soit appuye
    while (clic == false){
        pause(0.01);
        clic = getMouse().down;
    }
    
	// enregistre la position de la tuile cliquee 
    var coord = coordTuiles(getMouse().x, getMouse().y);
    
    return({x: coord[0], y: coord[1]});
};



// fonction qui place les mines dans le jeu de facon aleatoire en evitant 
// d'en placer une sous la premiere tuile cliquee par le joueur; la fonction
// retourne un tableau indiquant l'emplacement de toutes les mines
var placerMines = function(largeur, hauteur, nbMines, x, y){
    
    var coordClic = [x,y]; // emplacement de la premiere tuile cliquee
    var rangeeMines = [];  // rangees dans le tableau a construire
    var tabMines = [];	   // tableau a construire 
    
	// verifie que les parmetres d'entree sont valides
    var condLargeur = (largeur>0 && largeur===+largeur);
	var condHauteur = (hauteur>0 && hauteur===+hauteur);
	var condX = (x>=0 && x<largeur && x===+x);
    var condY = (y>=0 && y<hauteur && y===+y);
	var condMines = (nbMines>=0 && nbMines<largeur*hauteur && 
					nbMines===+nbMines);
	
	// si les parametres d'entree sont valides, continue l'execution 
	// de la fonction
    if (condLargeur && condHauteur && condX && condY && condMines){
		
		// si le nombre de mines a placer est plus petit que 
		// largeur*hauteur-1, definit l'emplacement des mines a l'aide
		// de methode aleatoire
		if (nbMines < ((hauteur*largeur)-1)){
			
			for (var i=0; i<hauteur; i++){
				for (var j=0; j<largeur; j++){
					rangeeMines.push(false);
				}
				
				tabMines.push(rangeeMines);
				rangeeMines = [];
			}
			
			var k=0;
			while (k < nbMines){
				var xMine = Math.floor(Math.random()*largeur);
				var yMine = Math.floor(Math.random()*hauteur);
				var coordMine = [xMine, yMine];
				
				if ((tabMines[yMine][xMine] == false) && 
				   ((coordClic+"") != (coordMine+""))){
					tabMines[yMine][xMine] = true;
					k++;
				}
			}
			
		// si toutes les tuiles excepte la premiere tuile cliquee cachent 
		// des mines, definit l'emplacement des mines sans utiliser
		// de methode aleatoire
		} else if (nbMines == ((hauteur*largeur)-1)){
			
			for (var i=0; i<hauteur; i++){
				for (var j=0; j<largeur; j++){
					rangeeMines.push(true);
				}
				
				tabMines.push(rangeeMines);
				rangeeMines = [];
			}
			
			tabMines[coordClic[1]][coordClic[0]] = false;
		}
		
		return (tabMines);
		
		
	// s'il y a une invalidite dans les parametres d'entree, 
	// retourne un tableau vide	
	} else {	
		return ([]);
    }
};



// procedure qui affiche a l’ecran a la coordonnee (x,y) l’image indiquee par le
// parametre image qui utilise des couleurs definies par le parametre colormap
var afficherImage = function(x, y, colormap, image){
    
    // verifie que les entrees x et y sont valides
    var condX = (x>=0 && (x+image[0].length)<=getScreenWidth() && x===+x);
    var condY = (y>=0 && (y+image.length)<=getScreenHeight() && y===+y);
    
    //si les entrees sont valides, l'image est affichee
    if (condX && condY){
        for(var i = 0; i <image.length; i++ ){
            var rang = image[i];
            for(var j = 0; j < rang.length; j++){
                var color = colormap[rang[j]];
                setPixel(x+j, y+i, color);
            }
        }
    }
};



// fonction qui transforme les coordonnees de tuiles en coordonnes de pixel
var coordTuiles = function(coordX, coordY){
    coordX = Math.floor(coordX / 16);
    coordY = Math.floor(coordY / 16);
    return ([coordX, coordY]);
};



// fonction qui verifie l'image a afficher pour une tuile specifique
var obtNumImage = function(x,y,tabMines){
	
    // si c'est une mine, utiliser l'image de mine (i.e. numero 9)
    if(tabMines[y][x] == true)
        return 9;
    
    // si ce n'est pas une mine, compter le nombre de mines adjacentes
	// et utiliser l'image avec le chiffre approprie
    var mines = 0;
    var positionX = [x - 1, x, x + 1];
    var positionY = [y - 1, y, y + 1];
    
    for(var i = 0 ; i < positionX.length; i++){
        for(var j = 0; j < positionY.length; j++){
            var posX = positionX[i];
            var posY = positionY[j];
            if(0<=posX && posX<tabMines[0].length
               && 0<=posY && posY<tabMines.length){
                mines = tabMines[posY][posX] == true ? mines + 1 : mines;
            }
        }
    }
    return mines;
};



// tests unitaires de la procedure afficherImage et la fonction placerMines
var testDemineur = function(){
    
    // nous nous limitons a un ecran de 6X6 pixels pour les tests
    setScreenMode(4,4);	
	
	// creation de petites images a utiliser pour les tests
	var imagesTests =
    [
     [ // 0
      [8,8],
      [8,0],
     ],
     [ // 1
      [8,1],
      [8,1],
     ],
	 [ // 2
      [3,3,3]
     ],
	 [ // 3
      [8,9],
      [8,9],
      [8,9],
     ]];
	
	
   	assert (exportScreen(afficherImage(0,0,colormap,imagesTests[0])) == 
	"#808080#808080#000000#000000\n#808080#c0c0c0#000000#000000\n#000000#" + 
	"000000#000000#000000\n#000000#000000#000000#000000");
	assert (exportScreen(afficherImage(2,2,colormap,imagesTests[1])) == 
	"#808080#808080#000000#000000\n#808080#c0c0c0#000000#000000\n#000000#" +
	"000000#808080#0000ff\n#000000#000000#808080#0000ff");
	assert (exportScreen(afficherImage(2,2,colormap,imagesTests[0])) == 
	"#808080#808080#000000#000000\n#808080#c0c0c0#000000#000000\n#000000#" +
	"000000#808080#808080\n#000000#000000#808080#c0c0c0");
	assert (exportScreen(afficherImage(-2,2,colormap,imagesTests[3])) == 
	"#808080#808080#000000#000000\n#808080#c0c0c0#000000#000000\n#000000#" +
	"000000#808080#808080\n#000000#000000#808080#c0c0c0");
	assert (exportScreen(afficherImage("g",0,colormap,imagesTests[3])) == 
	"#808080#808080#000000#000000\n#808080#c0c0c0#000000#000000\n#000000#" +
	"000000#808080#808080\n#000000#000000#808080#c0c0c0");
	assert (exportScreen(afficherImage(2,1,colormap,imagesTests[3])) == 
	"#808080#808080#000000#000000\n#808080#c0c0c0#808080#ffffff\n#000000#" +
	"000000#808080#ffffff\n#000000#000000#808080#ffffff");
	assert (exportScreen(afficherImage(3,3,colormap,imagesTests[2])) == 
	"#808080#808080#000000#000000\n#808080#c0c0c0#808080#ffffff\n#000000#" +
	"000000#808080#ffffff\n#000000#000000#808080#ffffff");
	assert (exportScreen(afficherImage(6,7,colormap,imagesTests[2])) == 
	"#808080#808080#000000#000000\n#808080#c0c0c0#808080#ffffff\n#000000#" +
	"000000#808080#ffffff\n#000000#000000#808080#ffffff");
	
	
    assert (placerMines(6, 8, 40, 2, 1)[1][2] == false);
    assert (placerMines(6, 8, 47, 5, 4)[4][5] == false);
    assert (placerMines(6, 8, 48, 5, 4).length == 0);
    assert (placerMines(6, 8, 72, 5, 4).length == 0);
    assert (placerMines(6, 8, 47, 5, 4).length == 8);
    assert (placerMines(6, 8, 47, 5, 4)[0].length == 6);
    assert (placerMines(6, 8, "a", 5, 4).length == 0);
    assert (placerMines(6, 8, 30, 100, 4).length == 0);
    
    // reinitialisation de l'ecran apres les tests
    setScreenMode(4,4);
};

testDemineur();
