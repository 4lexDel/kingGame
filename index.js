const { express, open, app, io, server, path } = require("./conf");
const { Player } = require("./Player");
const { Item } = require("./Item");
const { Message } = require("./Message");
const { Bullet } = require("./Bullet");
const { MachineGun } = require("./Weapon/MachineGun");
const { ShotGun } = require("./Weapon/ShotGun");
const { Weapon } = require("./Weapon/Weapon");

app.use("/static", express.static(path.resolve(__dirname, "public", "static")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

const port = 5000;

(async() => {
    //await open('http://localhost:' + port + '/');
})();

server.listen(port, 'localhost', () => { //SERVEUR //10.144.129.192
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

    socket.on("collect_item", () => {
        let player = Player.getPlayerBySocketID(socket.id);

        if (player != null) {
            let itemCollected = checkCollision(player.x, player.y, player.size, Item.items);

            if (itemCollected) {
                player.itemSelected = itemCollected.name;

                switch (itemCollected.name) {
                    case "MachineGun": //2
                        player.weapon = new MachineGun(socket.id);
                        break;

                    case "ShotGun": //3
                        player.weapon = new ShotGun(socket.id);
                        break;

                    default: //0
                        player.weapon = new ShotGun(socket.id);
                        break;
                }
                Item.removeItemByID(itemCollected.id);
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

/**------------------------------------------ */
var minX = -10000;
var minY = -10000;

var maxX = 10000;
var maxY = 10000;

generateMap();

setInterval(() => {
    update();
}, 10);

function update() {
    refreshMap();
    moveBullet();
    refreshItem();
}

/**-------------------------------------------- */

function generateMap() {
    let nbWeapons = 3000;

    //1-5 MachineGun
    //6-8 ShotGun
    //9-10 Sniper
    //11-13 Rocket

    for (let i = 0; i < nbWeapons; i++) {
        let rx = parseInt(getRandomNumber(minX, maxX));
        let ry = parseInt(getRandomNumber(minY, maxY));

        let type = parseInt(getRandomNumber(1, 13));

        if (type <= 5) {
            new Item("MachineGun", rx, ry);
            continue;
        }
        if (type <= 8) {
            new Item("ShotGun", rx, ry);
            continue;
        }
        if (type <= 10) {
            new Item("Sniper", rx, ry);
            continue;
        }
        if (type <= 13) {
            new Item("Rocket", rx, ry);
            continue;
        }
    }
    // console.log(Item.items);
}

function getRandomNumber(min, max) {
    return min + Math.random() * (max - min);
}


function refreshMap() {
    if (Player.players.length > 0) io.to("main").volatile.emit("map_update", { players: Player.players, bullets: Bullet.bullets, items: Item.items });
}

function checkCollision(x1, y1, r1, listObj) { //listObj contain instance with : x, y, size
    for (const key in listObj) {
        const element = listObj[key];
        if (dist(x1, y1, element.x, element.y) <= r1 + element.size) return element;
    }

    return undefined;
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function moveBullet() {
    Bullet.bullets.forEach(bullet => {
        bullet.move();
    });
}

function refreshItem() {
    Item.items.forEach(item => {
        item.frameCount++;
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