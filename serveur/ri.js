
   //Increase roomno 2 clients are present in a room.
  
   if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].
   adapter.rooms["room-"+roomno].length > 1) { 
    roomno++;
   }
  
   if(roomPlayer[roomPlayer.length-1].socketId.length==2){
    socket.to(roomPlayer[roomPlayer.length-1].socketId[0]).emit("jouer")
    socket.to(roomPlayer[roomPlayer.length-1].socketId[1]).emit("jouer")
     rp =new Users();
     roomPlayer.push(rp)
    
   }
   rp.socketId.push(socket.id)
   socket.join("room-"+roomno);
   socket.on("pret",()=>{
    roomPlayer[roomPlayer.length-1].nbrejoin++;
    
    if(roomPlayer[roomPlayer.length-1].nbrejoin <2)
        io.sockets.to(roomPlayer["room-"+roomno]).emit("patienter")
    else{
      io.sockets.to(roomPlayer[roomPlayer.length-1].socketId[1]).emit("lancer")
      io.sockets.to(roomPlayer[roomPlayer.length-1].socketId[0]).emit("lancer")
     
    }
   
   })
     if(io.nsps['/'].
   adapter.rooms["room-"+roomno].length==2){
    io.sockets.to(roomPlayer[roomPlayer.length-1].socketId[1]).emit('currentPlayer',{current:1,opponent:0});
    io.sockets.to(roomPlayer[roomPlayer.length-1].socketId[0]).emit('currentPlayer',{current:0,opponent:1});
    socket
    if( roomPlayer[roomPlayer.length-1].nbrejoin===2){
     // io.sockets.to(roomPlayer[roomPlayer.length-1].socketId[1]).emit("jouer")
      //io.sockets.to(roomPlayer[roomPlayer.length-1].socketId[0]).emit("jouer")
      
     
    }
   
    socket.on("playerAndPosition",(data)=>{
     
        roomPlayer[roomPlayer.length-1].players[0]=data.player
     
        roomPlayer[roomPlayer.length-1].players[1]=data.player
      
      
    })
    
    
/*
    socket.on("pret",()=>{
     
      roomPlayer[roomPlayer.length-1].nbrejoin++;
      io.sockets.in("room-"+roomno).emit("attente_adversaire")
    if(roomPlayer[roomPlayer.length-1].nbrejoin===2){
      io.sockets.in("room-"+roomno).emit('jouer');
    }
   
      
    
      
   // io.sockets.to(roomPlayer[roomPlayer.length-1].socketId[0])
     
   console.log(roomPlayer[roomPlayer.length-1].nbrejoin) 

    })*/
    socket.on("demarrer",function(){
       //io.sockets.to(roomPlayer[roomPlayer.length-1].socketId[0]).emit("jouer")
      //io.sockets.to(roomPlayer[roomPlayer.length-1].socketId[1]).emit("jouer")
     socket.to(roomPlayer[roomPlayer.length-1].socketId[0]).emit("jouer")
     socket.to(roomPlayer[roomPlayer.length-1].socketId[1]).emit("jouer")
      
    })

    
    socket.on("player",()=>{
        
      io.sockets.to(roomPlayer[roomPlayer.length-1].socketId[0]).emit('opponent',roomPlayer[roomPlayer.length-1].players[1]);
      io.sockets.to(roomPlayer[roomPlayer.length-1].socketId[1]).emit('opponent',roomPlayer[roomPlayer.length-1].players[0]);
    

    })
      // socket.on("player",(player)=>{
        
      //io.sockets.to(roomPlayer[roomPlayer.length-1].socketId[0]).emit('jouer',  );
      //io.sockets.to(roomPlayer[roomPlayer.length-1].socketId[1]).emit('opponent', roomPlayer[roomPlayer.length-1].players[0]);
      // })
     //  
       
      }
       
   
      
  
   //Send this event to everyone in the room.
   
  
})
