const { express, open, app, io, server, path } = require("./conf");
const { Player } = require("./Player");
const { Message } = require("./Message");
const { Bullet } = require("./Bullet");
// const { Room } = require("./Room");

app.use("/static", express.static(path.resolve(__dirname, "public", "static")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

const port = 5000;

(async() => {
    //await open('http://localhost:' + port + '/');
})();

server.listen(port, 'localhost', () => { //SERVEUR
    console.log('Ecoute sur le port ' + port);
});

io.on('connection', (socket) => {
    console.log("Bonjour " + socket.id); //Première connexion

    socket.on("join_game", (pseudo) => {
        disconnectPlayer(socket);

        socket.join("main");

        let color = "rgb(" + getRandomNumber(0, 200) + "," + getRandomNumber(0, 200) + "," + getRandomNumber(0, 200) + ")";

        let newPlayer = new Player(socket.id, "main", pseudo, color, "Player");
        newPlayer.x = getRandomNumber(-200, 200);
        newPlayer.y = getRandomNumber(-200, 200);

        Player.addPlayer(newPlayer);

        io.to("main").emit("players_list", Player.players);

        io.to(socket.id).emit("text_message", Message.messages);

        // console.log(Player.players);
    });

    socket.on("disconnect", async() => {
        console.log("Au revoir " + socket.id);

        disconnectPlayer(socket);
        // console.log(Player.players);

        io.to("main").emit("players_list", Player.players);
    });

    socket.on("move", (dx, dy) => {
        if (dx != undefined && dy != undefined) {
            let playerObj = Player.getPlayerBySocketID(socket.id);

            if (playerObj) playerObj.move(dx, dy);
        }
    });

    socket.on("shot", (x, y, alpha) => {
        if (x != undefined && y != undefined && alpha != undefined) {
            let player = Player.getPlayerBySocketID(socket.id);

            if (player != null) {
                player.shot(x, y, alpha);
            }
        }
    });

    socket.on("send_message", (content) => {
        let player = Player.getPlayerBySocketID(socket.id);

        if (player != null) {
            let newMessage = new Message(player, content);

            Message.addMessage(newMessage);

            io.to("main").emit("text_message", Message.messages);
        }
    });
});

setInterval(() => {
    update();
}, 10);

function update() {
    refreshMap();
    checkCollision();
    moveBullet();
}

function refreshMap() {
    if (Player.players.length > 0) io.to("main").emit("map_update", Player.players, Bullet.bullets);
}

function checkCollision() {
    //for
}

function moveBullet() {
    Bullet.bullets.forEach(bullet => {
        bullet.move();
    });
}

// socket.on("join_room", (room, pseudo) => { //Vire d'une room dans tous les cas ????????
//     if (io.sockets.adapter.rooms.has(room)) { //Est ce que la room existe
//         disconnectPlayer(socket);

//         socket.join(room);

//         let roomObj = Room.getRoomByRoomID(room); //IMPORTANT

//         let currentPlayer1 = roomObj.getPlayerByStatus("Player1");
//         let currentPlayer2 = roomObj.getPlayerByStatus("Player2");

//         let status = null;

//         if (currentPlayer1 == null) status = "Player1";
//         else if (currentPlayer2 == null) status = "Player2";
//         else status = "Spectator";

//         let newPlayerObj = new Player(socket.id, room, pseudo, status);

//         io.to(socket.id).emit('room_joined', 1, newPlayerObj, "Room joined !");

//         Player.addPlayer(newPlayerObj);

//         if (roomObj != null) {
//             roomObj.addPlayer(newPlayerObj);

//             messageToSocket(socket, "grid_refresh", roomObj.bobail.grid);
//             let content = getRealTimeInformation(roomObj);
//             messageToSocket(socket, "real_time_info", content);
//         }

//         broadcast(socket, room, "players_list", Player.getPlayersByRoomID(room), true); //Liste des joueurs
//     } else {
//         io.to(socket.id).emit('room_joined', 0, null, "This room dosn't exist...");
//     }
// });

// socket.on("create_room", (room, pseudo) => {
//     if (!io.sockets.adapter.rooms.has(room)) { //Est ce que la room n'existe pas ?
//         disconnectPlayer(socket);

//         socket.join(room);

//         let newPlayerObj = new Player(socket.id, room, pseudo, "Player1", true); //Admin
//         Player.addPlayer(newPlayerObj);

//         let newRoomObj = new Room(room, newPlayerObj);
//         Room.addRoom(newRoomObj); //IMPORTANT

//         let grid = newRoomObj.startGame();

//         //messageToSocket(socket.id, "");

//         io.to(socket.id).emit('room_created', 1, newPlayerObj, "Room created !"); //Probleme asynchrone ?? ==> DOIT ARRIVER AVANT !!

//         messageToSocket(socket, "grid_refresh", grid);

//         let content = getRealTimeInformation(newRoomObj);
//         messageToSocket(socket, "real_time_info", content);

//         broadcast(socket, room, "players_list", Player.getPlayersByRoomID(room), true);
//     } else {
//         io.to(socket.id).emit('room_created', 0, null, "This room already exist...");
//     }
// });


function disconnectPlayer(socket) {
    let player = Player.getPlayerBySocketID(socket.id);
    if (player != null) {
        let room = player.roomID;
        Player.removePlayerBySocketID(socket.id);
        // let roomObj = Room.getRoomByRoomID(room);
        // if (roomObj != null) {
        //     roomObj.removePlayerBySocketID(socket.id);
        // }
        //broadcast(socket, room, "players_list", Player.getPlayersByRoomID(room));
    }
}

// function disconnectPlayer(socket) {
//     leaveAllRoom(socket);
//     let player = Player.getPlayerBySocketID(socket.id);

//     if (player != null) {
//         let room = player.roomID;

//         Player.removePlayerBySocketID(socket.id);

//         let roomObj = Room.getRoomByRoomID(room);
//         if (roomObj != null) {
//             roomObj.removePlayerBySocketID(socket.id);
//         }

//         broadcast(socket, room, "players_list", Player.getPlayersByRoomID(room));
//     }
// }



function countPlayerInRoom(room) {
    let players = io.sockets.adapter.rooms.get(room);

    if (players == null) return -1;

    return players.size;
}

function messageToSocket(socket, event, data) {
    io.to(socket.id).emit(event, data);
}

function broadcast(sender, room, event, data, all = false) {
    if (all) io.to(room).emit(event, data);
    else sender.to(room).emit(event, data);
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}