const { MachineGun } = require("./Weapon/MachineGun");
const { ShotGun } = require("./Weapon/ShotGun");
const { Weapon } = require("./Weapon/Weapon");

class Player {
    static players = [];

    constructor(socketID, roomID, pseudo, color, status = "Player") {
        this.socketID = socketID;
        this.pseudo = pseudo;
        this.roomID = roomID;
        this.status = status;
        this.color = color;
        this.isKing = false;

        this.x = 100;
        this.y = 100;

        this.size = 20;

        this.itemSelected = "Gun"; //A refacto
        this.weapon = new ShotGun(socketID);
        //this.weapon = new MachineGun(socketID);
    }

    static addPlayer(player) {
        Player.players.push(player);
    }

    static removePlayerBySocketID(socketID) {
        Player.players = Player.players.filter((player) => {
            if (player.socketID != socketID) return player;
        })
    }

    static getPlayerBySocketID(socketID) {
        let player = Player.players.find((player) => {
            if (player.socketID == socketID) return player;
        });

        return player;
    }

    static getPlayersByRoomID(RoomID) {
        let player = Player.players.filter((player) => {
            if (player.roomID == RoomID) return player;
        });

        return player;
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    shot(x, y, dx, dy) {
        this.weapon.shot(x, y, dx, dy);
    }
}


module.exports = { Player }