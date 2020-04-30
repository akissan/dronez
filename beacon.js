let beacon_img;

class Beacon extends Entity {
  constructor(pos = createVector(0, 0), name = "Becault", colRad = 75) {
    super("Beacon", colRad, pos, random() * 0.5 + 0.5, name);
    this.ticksBeforeNewTrash = random(3000, 5000);
    this.phase = random(11);
  }

  tick() {
    this.ticksBeforeNewTrash -= deltaTime;
    if (this.ticksBeforeNewTrash < 0) {
      this.ticksBeforeNewTrash = random(8000, 14000);
      this.trash += random() * 0.2 + 0.02;
      this.trash = min(this.trash, 1.0);
    }
  }

  draw() {
    this.time += deltaTime;
    image(beacon_img[Math.round(this.phase + this.time * 0.0055) % 10], this.pos.x - 45, this.pos.y - 25 + Math.sin(this.time * 0.0035) * 4, 90, 90);
    noFill();
    stroke(1);
    rect(this.pos.x - 15, this.pos.y + 70, 30, 6);
    noStroke();
    fill(60, 100, 60);
    rect(this.pos.x - 14, this.pos.y + 71, Math.round(28 * this.trash), 4);
  }
}