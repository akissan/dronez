let droneStats = {};
let beaconStats = {};
let binStats = {};

const init_stats = () => {
  droneStats = {
    strokeW: 1,
    visRad: 15,
    CollideColor: color(160, 40, 40, 45),
    noCollideColor: color(60, 40, 40, 25),
    getColor: function(e) {
      return color(50, 50, lerp(50, 255, e.trash / e.maxTrash))
    }
  }

  beaconStats = {
    strokeW: 2,
    visRad: 25,
    CollideColor: color(160, 90, 0, 45),
    noCollideColor: color(60, 90, 0, 25),
    getColor: function(e) {
      return color(50, lerp(50, 255, e.trash), 50);
    }
  }

  binStats = {
    strokeW: 2,
    visRad: 35,
    CollideColor: color(160, 0, 90, 45),
    noCollideColor: color(60, 0, 90, 25),
    getColor: function(e) {
      return color(60, 85, 150)
    }
  }
}

const getStatsForEntityType = eT => {
  switch (eT) {
    case "Drone":
      return droneStats;
    case "Beacon":
      return beaconStats;
    case "Bin":
      return binStats;
    default:
      console.log("Incorrect entity type passed to super");
  }
}

class Entity {
  constructor(entityType, colRad, pos = createVector(0, 0), trash = 0, name = "Default") {
    this.trash = trash;
    this.pos = pos;
    this.isColliding = false;
    this.stats = getStatsForEntityType(entityType);
    this.entityType = entityType;
    this.collideRad = colRad;
    this.collideWith = [];
    this.name = name;
    this.phase = 0;
    this.time = 0;
  }

  drawCollider() {
    noStroke();
    fill(color(this.isColliding ? this.stats.CollideColor : this.stats.noCollideColor));
    circle(this.pos.x, this.pos.y, this.collideRad);
  }

  draw() {
    strokeWeight(this.stats.strokeW);
    stroke(0);
    fill(this.stats.getColor(this));
    circle(this.pos.x, this.pos.y, this.stats.visRad);
  }
}