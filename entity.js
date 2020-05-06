const createEntityStats = (strokeW, visRad, CollideColor, noCollideColor, getColor) => {
    return { strokeW, visRad, CollideColor, noCollideColor, getColor };
}

const getStatsForEntityType = eT => {
    switch (eT) {
        case "Drone":
            return createEntityStats(1, 15, color(160, 40, 40, 45), color(60, 40, 40, 25), e => color(50, 50, lerp(50, 255, e.trash / e.maxTrash)));
        case "Beacon":
            return createEntityStats(2, 25, color(160, 90, 0, 45), color(60, 90, 0, 25), e => color(50, lerp(50, 255, e.trash), 50));
        case "Bin":
            return createEntityStats(2, 35, color(160, 0, 90, 45), color(60, 0, 90, 25), e => color(60, 85, 150));
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