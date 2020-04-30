let bcg;

const drones = [];
const beacons = [];
const bins = [];

let inp = 0;

function preload() {
  load_drone_imgs();
  drone_img_idle = loadImage('drone_sprites/idle.png');
  beacon_img = load_animation('bouy');
  bin_img = load_animation('bin');
}

const load_drone_imgs = () => {
  drone_img.push(loadImage('drone_sprites/E.png'));
  drone_img.push(loadImage('drone_sprites/SE.png'));
  drone_img.push(loadImage('drone_sprites/S.png'));
  drone_img.push(loadImage('drone_sprites/SW.png'));
  drone_img.push(loadImage('drone_sprites/W.png'));
  drone_img.push(loadImage('drone_sprites/NW.png'));
  drone_img.push(loadImage('drone_sprites/N.png'));
  drone_img.push(loadImage('drone_sprites/NE.png'));
}

const load_animation = (name) => {
  let load = [];
  for (let i = 1; i < 11; i++) {
    load.push(loadImage(`${name}_sprites/${i}.png`))
  }
  return load;
}

let button;

function setup() {
  init_stats();
  refreshOnSpawn = true;
  createCanvas(1000, 600);
  textAlign(CENTER);
  bcg = color("#ABC5CC");
  drones.push(new Drone(randomScrPoint(20), "Fox"));
  bins.push(new Bin(createVector(42, 42), "Binya"));

  button = createButton("");
  button.addClass("modeButton");
  button.addClass(`mode_${inp}`);
  button.position(width - 100, height - 100);
  button.mousePressed(changeInput);
}

const changeInput = () => {
  button.removeClass(`mode_${inp}`);
  inp == 2 ? inp = 0 : inp += 1;
  button.addClass(`mode_${inp}`);
}

function mousePressed() {
  if (mouseX <= width && mouseX >= 0 && mouseY <= height - 100 && mouseY >= 0) {
    switch (inp) {
      case 0:
        beacons.push(new Beacon(createVector(mouseX, mouseY), `New`));
        break;
      case 1:
        drones.push(new Drone(createVector(mouseX, mouseY), `New`));
        break;
      case 2:
        bins.push(new Bin(createVector(mouseX, mouseY), `New`));
        break;
    }
    drones.forEach(d => d.lookForTarget());
  }
}

function draw() {
  background(bcg);
  collideArrays(drones, [...beacons, ...bins]);
  act_array(drones);
  //draw_collide_array([...drones, ...beacons, ...bins]);
  draw_array([...beacons, ...bins, ...drones]);
  tick_array([...beacons]);
}