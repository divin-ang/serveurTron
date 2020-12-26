// index.js précedent v2



var socket = io.connect('http://127.0.0.1:8080/');
//var socket = io.connect('http://10.0.2.2:8080/');




// -------------------------------------------
const PIX = 17;

// Récupérer les pseudos des 2 joueurs :
let pseudo1 = "pseudo1" // le pseudo du client
let pseudo2 = "pseudo2" // le pseudo de l'adversaire
// Définition des 2 joueurs :
let position = [{x:2, y:12}, {x:18, y:12}]
let color = ['rgb(51,114,255)', 'rgb(103,255,51)']
let direction = ['right', 'left']

let score =0;
let currentPlayer = 0; // Joueur courant (à définir au niveau du serveur)
let opponentPlayer = 1;

socket.on("pseudo",function(pseudo){
  
  pseudo1=pseudo.pseudo1
  pseudo2 = pseudo.pseudo2
})
// Paramètres du plateau de jeu :
let WIDTH = 23;
let HEIGHT = 23;
let playground = new Playground(WIDTH, HEIGHT);

let numeroRoom =0;
socket.on("numRoom",(data)=>{
  numeroRoom =data;

 })


//-------------------------------
let game = false; // Initialisation de l'état de la partie à false

let valider = document.getElementById("valider-pseudo");


 socket.emit("numRoom",numeroRoom)
 valider.onclick =function(){
  //socket.emit("pseudo",{pseudo:document.getElementById("pseudo").value,num:numeroRoom})
    socket.emit("username",document.getElementById("pseudo").value)
 
}

socket.on('save',(data)=>{
  socket.emit("pret",data.pseudo)
 

  document.getElementById("loader").style.display="block"
  document.getElementById("attente").style.display="inline"
    score =data.score
    document.getElementById("div-pseudo").style.display="none"
    

})

// -------------------------------
socket.on("lancer",()=>{
  document.getElementById("loader").style.display="none"
  
  document.getElementById("attente").style.display="none"
  socket.emit("demarrer",numeroRoom)
})
socket.on("jouer",()=>{
  document.getElementById("att").textContent="Adversaire trouvé, votre jeu va demarrer dans"
  let i =8
  setInterval(() => {
    document.getElementById("seconde").textContent =i
    i--;
  }, 1000);
  setTimeout(()=>{
    document.getElementById("att").style.display="none"
    document.getElementById("seconde").style.display="none"
    
    game = true;
  },8000)
  
})

socket.on("currentPlayer",(data)=>{
  
  currentPlayer=data.current;
  opponentPlayer=data.opponent
  player1 = new Player(pseudo1, position[currentPlayer].x, position[currentPlayer].y, direction[currentPlayer], color[currentPlayer]);
  //player2 = undefined;
  player2 = new Player(pseudo2, position[opponentPlayer].x, position[opponentPlayer].y, direction[opponentPlayer], color[opponentPlayer]);
  
  
  console.log("affiché")
 
})



// Initialisation du plateau de jeu et des deux joueurs :
function setup() {
    canva = createCanvas(WIDTH*PIX, HEIGHT*PIX);
    canva.hide();
    frameRate(1);
  
    // Initialisation des 2 joueurs :
  
}


// Après la fonction setup(), la fonction draw() est continuellement appelée
function draw() {
    background(40);
   
     
    if (game == true) {
     
        //socket.emit("playerAndPosition",{player:player1,currentPlayer:currentPlayer,num:numeroRoom})
        
      canva.show();
      playGame()
    };
}

let debut;
let fin;
let lastPositionP2;

let winner=""; // Initialisation du gagant à "" (aucun gagant en début de partie)

// Fonction de jeu : fait jouer les joueurs sur le plateau et dessine le plateau de jeu
function playGame(){ 
     if(debut ==undefined){
       debut=new Date();
       lastPositionP2 = player2.position
       

     }else{
       fin =new Date();
       if(fin.getTime()>=debut.getTime()+1000 ){
         console.log("fin.getTime()>=debut+1000 ")
         console.log(lastPositionP2)
         console.log(player2.position)
         console.log(player1.position)
         if(lastPositionP2 ==player2.position ){
          console.log(" lastPositionP2 === player2.position ")
          winner = player1

         }
         
           else{
            console.log(" reinit ")
                debut = new Date();
                lastPositionP2 = player2.position


          }
       }else {
         console.log("aff")
       }
     }
    player1.play(); // Faire jouer le joueur 1 dans le plateau de jeu
  
  
    
    socket.emit('player', {player:player1,num:numeroRoom}); // Envoyer la position et la direction du joueur 1 à l'adversaire
    score++
    document.getElementById("score").textContent=score
    if (winner == "") winner = player1.collisionFacingOpponent(player2); // Vérification de la collision de face des deux joueurs : s'ils se heurtent de face, affectation du gagnant à "tie"
    if (winner == "") winner = playground.collisionWithEdges(player1, player2); // Vérifier si le joueur 1 dépasse les limites du plateau de jeu. S'il dépasse, le gagnant = joueur 2
    //if (winner == "") winner = playground.collisionWithEdges(player2, player1);
    if (winner == "") winner = playground.collisionWithOpponent(player1, player2); // Vérifier si le joueur 1 recontre un mur (son propre mur ou le mur de l'adversaire). S'il rencontre un mur, le gagnant = joueur 2
    
    
    if (winner == "") {playground.placePlayerInTab(player1);playground.drawTab();} // S'il n'y a pas de gagant : on place le joueur 1 dans le plateau de jeu
    
    if (winner != "") {
        socket.emit('winner',{winner:winner,num:numeroRoom}); // Envoyer le nom du gagant au joueur adverse ------------------------------------------------------------------------------------------
        game=false; // S'il y a un gagant : arrêt de la partie
       // socket.emit("score1",{score:score,pseudo:pseudo1})
        
    }
    
}
socket.on("disconnected",function(){
  socket.emit("deconnecte",numeroRoom)
})

 /* let lastPositionP2 =player2.position
    setTimeout(function(){},1000)
    if(player2.position ===lastPositionP2)
    winner = player1;*/


// Récupérer les évènements onkeydown qui vont modifier la direction du joueur :
document.onkeydown = function(event){
    switch(event.keyCode) {
        case 37:
            player1.changeDirection("left");
            break;

        case 38:
            player1.changeDirection("up");
            break;

        case 39:
            player1.changeDirection("right");
            break;

        case 40:
            player1.changeDirection("down");
            break;
    }
}




// Receptionner la socket contenant les positions et la direction de l'adversaire
socket.on('opponent', function(player){
  if (player2 == undefined) player2 = new Player(player.name, player.position.x, player.position.y, player.direction, player.color); // Si le joueur n'est pas défini : on définit l'adversaire avec les attributs contenus dans player

  else {player2.update(player)
  
    } // Sinon : mise à jour du joueur avec les attributs contenus dans player
  
  /*if (winner == "") winner = player1.collisionFacingOpponent(player2);
  if (winner != "") game=false;*/
  playground.placePlayerInTab(player2); // Placer le joueur adverse dans le plateau de jeu
  
  playground.drawTab(); // Dessiner le plateau de jeu

});




// Réceptionner la socket contenant le gagant ------------------------------------------------------------------------------------------
socket.on('winner', function(winner2){
    winner = winner2; // Affectation du gagnant à la variable winner
    console.log("pseudo1 ="+pseudo1)
    console.log(winner)
  if(winner.name===pseudo1){

      document.getElementById("resultat").textContent="Bravo "+pseudo1+" vous  avez gagné !"
  }else if(winner.name===pseudo2){
    document.getElementById("resultat").textContent="Defaite !"+pseudo1 +"  vous avez  perdu !"
  }else{
    document.getElementById("resultat").textContent="Match nul entre vous et "+pseudo2
  }
});



  // DANS SERVER.js :
  /*
 socket.on('winner', function(winner){
    socket.broadcast.emit('winner', winner);
  });*/ 