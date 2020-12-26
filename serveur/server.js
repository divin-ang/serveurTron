var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const Joueur = require('./models/joueur');
process.setMaxListeners(1000)
let Room = require('./Room.js');


//::::::::::::::::::::::::::::::::::::::::::::::::::::: connection base des données//
// fonction permettant la connection à la base des donnée avec mongoose
// prend en paramètre le nom de la base des données.
let connectionBd = require('./ConnectionBdService.js');
let winnerScore;
connectionBd("Tron")

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

  io.on('connection', function(socket){
     console.log('a user connected');
    
     socket.on('disconnect', function () {
       console.log('socket disconnected');
      
     });


    socket.send('Hello');

    // or with emit() and custom event names
    socket.emit('greetings', 'Hey!', { 'ms': 'jane' }, Buffer.from([4, 3, 3, 1]));

    // handle the event sent with socket.send()
    socket.on('message', (data) => {
      
    });

    // handle the event sent with socket.emit()
    socket.on('salutations', (elem1, elem2, elem3) => {
      console.log(elem1, elem2, elem3);
    });

/*
    socket.on('player', function(player){
      //console.log(player);
      
      socket.broadcast.emit('opponent', player);
    });
    */
});

let roomno = 0;

let roomPlayer=[]
let rp = new Room()
rp.name=roomno+""
roomPlayer.push(rp)


let nRoom=0;
io.sockets.on('connection', function(socket) {
  socket.on("numRoom",(data)=>{
    nRoom=data
   
  })

  socket.on("username",function(data){
    console.log("entrer")

    Joueur.findOne({ 'pseudo': data }, function (err, user) {
      if(err){
        console.log("echec")
      }
      else if(user!=null){
        io.sockets.to(socket.id).emit("save",user)
        console.log(user)
      }else{
        var joueur= new Joueur();
        joueur.pseudo=data
        joueur.score =0
        io.sockets.to(socket.id).emit("save",joueur)
       joueur.save()
       
       
      }

     
     
    });
  })
 

  process.setMaxListeners(1000)
  
    
  
    socket.on("pseudo",(pseudo)=>{
    
    
    if(socket.id===roomPlayer[pseudo.num].socketId[0])
        roomPlayer[pseudo.num].pseudo[0]=pseudo.pseudo
      else if(socket.id===roomPlayer[pseudo.num].socketId[1])
         roomPlayer[pseudo.num].pseudo[1]=pseudo.pseudo
     })
    
   socket.on("pret",(pseudo)=>{
    let room = roomPlayer[roomPlayer.length- 1]
    room.socketId.push(socket.id)
    room.pseudo.push(pseudo)
    socket.join(""+roomno);
    io.sockets.to(""+roomno).emit("numRoom",roomno)
    

    if (roomPlayer[roomPlayer.length-1].socketId.length==2){
     
   io.sockets.to(socket.id).emit("numRoom",roomno)
    
   io.sockets.to(roomno+"").emit("jouer")
   io.sockets.to(roomno+"").emit("lancer")
   let pseudos = roomPlayer[roomno].pseudo
   io.sockets.to(roomPlayer[roomno].socketId[0]).emit("pseudo",{pseudo1:pseudos[0],pseudo2:pseudos[1]})
   io.sockets.to(roomPlayer[roomno].socketId[1]).emit("pseudo",{pseudo1:pseudos[1],pseudo2:pseudos[0]})
  
   io.sockets.to(roomPlayer[roomno].socketId[1]).emit('currentPlayer',{current:1,opponent:0});
   io.sockets.to(roomPlayer[roomno].socketId[0]).emit('currentPlayer',{current:0,opponent:1});
   roomno++;
 
  let room =new Room();
   

roomPlayer.push(room)   
 
 }


})
let num =0;
socket.on("numRoom",(data)=>{
  num=data
})
socket.on('winner', function(winner){
  
  io.sockets.to(winner.num+"").emit('winner', winner.winner);
  
  console.log(winner.winner.name+" "+winner)
  Joueur.findOne({ 'pseudo': winner.winner.name},function(err,user){
    winnerScore=user.score+1
  })
  console.log(winnerScore)
  Joueur.findOneAndUpdate({ 'pseudo': winner.winner.name }, {"pseudo":winner.winner.name,"score":winnerScore},function (err, user) {
     
  }
  )
  
});


socket.on("demarrer",function(numRoom){

io.sockets.to(roomPlayer[numRoom].socketId[0]).emit("jouer")
io.sockets.to(roomPlayer[numRoom].socketId[1]).emit("jouer")

 
})

socket.on("player",(data)=>{
  
if(roomPlayer[data.num].socketId[0]==socket.id)
io.sockets.to(roomPlayer[data.num].socketId[1]).emit('opponent',data.player);
else
io.sockets.to(roomPlayer[data.num].socketId[0]).emit('opponent',data.player);
})
})

//Now server would listen on port 8080 for new connection

http.listen(8080, function(){
     console.log('listening on *:8080');
});