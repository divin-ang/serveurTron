// index.js précedent v2



var socket = io.connect('http://127.0.0.1:8080/');
//var socket = io.connect('http://10.0.2.2:8080/');




// -------------------------------------------
const PIX = 13;

// Récupérer les pseudos des 2 joueurs :
let pseudo1 = "pseudo1" // le pseudo du client
let pseudo2 = "pseudo2" // le pseudo de l'adversaire

// Définition des 2 joueurs :
let position = [{x:100, y:100}, {x:300, y:100}]
let color = ['rgb(51,114,255)', 'rgb(103,255,51)']
let direction = ['down', 'down']

let currentPlayer = 0; // Joueur courant (à définir au niveau du serveur)
let opponentPlayer = 1;


// Paramètres du plateau de jeu :
let WIDTH = 400;
let HEIGHT = 400;
let playground = new Playground(WIDTH, HEIGHT);




//-------------------------------
game = false; // Initialisation de l'état de la partie à false
let buttonPlay = document.getElementById("buttonPlay");
buttonPlay.onclick = function() {
 socket.emit("rejoindre")
 game = true;
}
// -------------------------------
socket.on("jouer",()=>{
 
})

socket.on("currentPlayer",(data)=>{
     currentPlayer =data.current;
    opponentPlayer =data.opponent
})

// Initialisation du plateau de jeu et des deux joueurs :
function setup() {
    canva = createCanvas(400, 450);
    canva.hide();
    frameRate(90);

   
    player1 = new Player(pseudo1, position[currentPlayer].x, position[currentPlayer].y, direction[currentPlayer], color[currentPlayer]);
    
    
    player2 = new Player(pseudo1, position[opponentPlayer].x, position[opponentPlayer].y, direction[opponentPlayer], color[opponentPlayer]);
}


// Après la fonction setup(), la fonction draw() est continuellement appelée
function draw() {
    background(40);
 
    if (game == true) {
      canva.show();
      playGame()
    };
}



function playGame(){
    player1.play(playground);
    playground.drawTab();
   socket.emit('player', player1);

  // 1) Vérifier les collisions de face (comparer player1.position+player1.direction avec player2.position+player2.direction)
  // 2) Vérifier les collisions de côté (comparer player1.position avec player2.position)
  // 3) Vérifier les collisions avec les bords du jeu (player1 VS playground) + (player2 VS playground)
  // (Attention pour les collisions : prendre en compte le diamètre du joueur : PIX)
}


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




socket.on('opponent', function(player){
   player2 = new Player(player.name, player.position.x, player.position.y, player.direction, player.color);
   {player2 = player2.update(player)}
  playground.placePlayerInTab(player);
  playground.drawTab();
});
