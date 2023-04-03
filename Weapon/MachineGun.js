const { Bullet } = require("../Bullet");
const { Weapon } = require("./Weapon");

class MachineGun extends Weapon {
    constructor(ownerID) {
        super(ownerID);

        this.name = "MachineGun";

        this.loadingDelay = 150;
        this.bulletTtl = 1000;

        this.speed = 15;

    }

    shot(x, y, alpha) {
        if (this.loading) {
            new Bullet(this.ownerID, x, y, this.speed * Math.cos(alpha), this.speed * Math.sin(alpha), this.bulletTtl);

            this.reloading();
        }
    }
}

module.exports = { MachineGun }