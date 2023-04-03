const { Bullet } = require("../Bullet");

class Weapon {
    constructor(ownerID) {
        this.ownerID = ownerID;

        this.name = "Weapon";

        this.loading = true;
        this.loadingDelay = 500;
        this.speed = 10;
    }

    shot(x, y, alpha) {
        if (this.loading) {
            new Bullet(this.ownerID, x, y, this.speed * Math.cos(alpha), this.speed * Math.sin(alpha));
            this.reloading();
        }
    }

    reloading() {
        this.loading = false;
        setTimeout(() => {
            this.loading = true;
        }, this.loadingDelay);
    }
}


module.exports = { Weapon }