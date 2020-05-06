class Bin extends Entity {
    constructor(pos = createVector(0, 0), name = "Binault", colRad = 75) {
        super("Bin", colRad, pos, 0, name);
        this.phase = random(11);
    }

    draw() {
        this.time += deltaTime;
        image(bin_img[Math.round(this.phase + this.time * 0.0055) % 10], this.pos.x - 125, this.pos.y - 115, 250, 250);
    }
}