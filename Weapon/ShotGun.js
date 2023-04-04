const { Bullet } = require("../Bullet");
const { Weapon } = require("./Weapon");

class ShotGun extends Weapon {
    constructor(ownerID) {
        super(ownerID);

        this.name = "ShotGun";

        this.loadingDelay = 500; //1000;
        this.bulletTtl = 300;

        this.speed = 30;
    }

    shot(x, y, alpha) {
        if (this.loading) {
            let delta = 0.1;

            new Bullet(this.ownerID, x, y, this.speed * Math.cos(alpha + 2 * delta), this.speed * Math.sin(alpha + 2 * delta), this.bulletTtl);
            new Bullet(this.ownerID, x, y, this.speed * Math.cos(alpha + delta), this.speed * Math.sin(alpha + delta), this.bulletTtl);
            new Bullet(this.ownerID, x, y, this.speed * Math.cos(alpha), this.speed * Math.sin(alpha), this.bulletTtl);
            new Bullet(this.ownerID, x, y, this.speed * Math.cos(alpha - delta), this.speed * Math.sin(alpha - delta), this.bulletTtl);
            new Bullet(this.ownerID, x, y, this.speed * Math.cos(alpha - 2 * delta), this.speed * Math.sin(alpha - 2 * delta), this.bulletTtl);

            this.reloading();
        }
    }
}


module.exports = { ShotGun }
