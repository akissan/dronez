let maxSteeringForce = 0.075;
let maxVisRotForce = 0.05;
let diff;
let toTarget;
let toTargetNormalized;
let approachDistance = 70;
let approachDistanceSq = approachDistance * approachDistance;
let desSpeed;
let drone_img = [];

class Drone extends Entity {
    constructor(pos = createVector(0, 0), name = "Default", colRad = 35, maxSpeed = 4) {
        super("Drone", colRad, pos, 0, name);
        this.curSpeed = 0;
        this.velvec = createVector(0, 0);
        this.visualDir = createVector(0, 0);
        this.isGathering = false;
        this.isDeploying = false;
        this.target = null;
        this.discoveredTargets = [];
        //
        this.maxSpeed = maxSpeed;
        this.maxAccel = 0.15;
        this.maxTrash = 4;
        this.radarRad = 120;
        //
        this.communicateRad = 90;
        this.bannedTargets = [];
    }

    setTarget(target) {
        this.target = target;
    }

    steer() {
        toTarget = p5.Vector.sub(this.target.pos, this.pos);
        toTargetNormalized = toTarget.copy().normalize();
        this.velvec.lerp(toTargetNormalized, maxSteeringForce);
        this.visualDir.lerp(toTargetNormalized, maxVisRotForce);
        if (toTarget.magSq() > approachDistanceSq) {
            desSpeed = this.maxSpeed;
        } else {
            desSpeed = lerp(0, this.maxSpeed, (this.target && this.target == this.collideWith) ? 0 : (toTarget.mag() / approachDistance));
        }
        this.curSpeed = lerp(this.curSpeed, desSpeed, this.maxAccel);
    }

    move() {
        this.pos.add(p5.Vector.mult(this.velvec, this.curSpeed));
    }

    lookForTarget() {
        let trashInTargets = getTrashInTargets(this.discoveredTargets);
        let mod = 0;
        while (trashInTargets < this.maxTrash && mod < 600) {
            let newTargets = getInRadius(this.pos, this.radarRad + mod, beacons);
            uniquePush(this.discoveredTargets, newTargets);
            trashInTargets = getTrashInTargets(this.discoveredTargets);
            mod += 15;
        }
        this.target = findNearest(this.discoveredTargets, this.maxTrash - this.trash, this.pos, false, this.bannedTargets);
    }

    lookForBin() {
        this.target = findNearest(bins, Number.POSITIVE_INFINITY, this.pos, true);
    }

    communicate() {
        if (this.target && this.target.entityType == "Beacon") {
            let nearbyDrones = getInRadius(this.pos, this.communicateRad, drones);
            nearbyDrones.forEach(ent => {
                if (ent != this) {
                    ent.ban(this.target)
                };
            });
        }
    }

    ban(target) {
        uniquePush(this.bannedTargets, [target]);
        if (target == this.target) {
            this.lookForTarget();
        }
    }

    checkCollide() {
        let anyGather = false;
        let anyDeploy = false;
        this.collideWith.forEach(ent => {
            if (ent.entityType == "Bin") {
                if (this.trash >= 0.001) {
                    anyDeploy = true;
                    transferTrash(ent, this, 0.1);
                } else if (ent == this.target) {
                    this.target = null;
                }
            } else if (ent.entityType == "Beacon") {
                if (ent.trash >= 0.0001 && this.trash < this.maxTrash) {
                    anyGather = true;
                    transferTrash(this, ent, 0.025);
                    uniquePush(this.discoveredTargets, [ent]);
                } else if (ent == this.target) {
                    this.target = null;
                }
            }
        })
        this.isGathering = anyGather;
        this.isDeploying = anyDeploy;
    }

    act() {
        this.communicate();
        this.checkCollide();
        if (!this.isGathering && !this.isDeploying && !this.target) {
            this.lookForTarget();
        }
        if (!this.target) {
            this.lookForBin();
        }
        if (this.target) {
            this.steer();
            this.move();
        }
        this.bannedTargets = [];
    }

    draw() {
        if (this.curSpeed < 0.1) {
            image(drone_img_idle, this.pos.x - 35, this.pos.y - 35, 70, 70);
        } else {
            let dir = degrees(this.visualDir.heading());
            let indx = Math.round(dir / 45);
            if (indx < 0) {
                indx = 8 - abs(indx);
            }
            image(drone_img[indx], this.pos.x - 35, this.pos.y - 35, 70, 70);
        }
        noFill();
        stroke(1);
        rect(this.pos.x - 15, this.pos.y + 25, 30, 6);
        noStroke();
        fill(255, 60, 0);
        rect(this.pos.x - 14, this.pos.y + 26, Math.round(28 * this.trash / this.maxTrash), 4);
    }
}