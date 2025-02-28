class Robot {
  constructor(x, y, z, camera) {

    this.initialPosition = { x, y, z };  
    this.camera = camera;                
    this.isChasing = false;              
    this.lastReturnTime = Date.now();    
    this.returnCooldown = 3000;         
    
    this.obj = document.createElement("a-entity");
    this.obj.setAttribute("gltf-model", "#robot");
	this.obj.setAttribute("animation-mixer", "");
    this.obj.setAttribute("position", this.initialPosition);
    this.obj.setAttribute("scale", "1 1 1");
    document.querySelector("a-scene").appendChild(this.obj);

  }

  chase() {
    if (!this.camera) return;

    let distance = this.distanceTo(this.camera);

    if (distance < 1) {  
        console.log("player caught by robot, back to origin");
        this.teleportPlayerToOrigin();
        return;
    }

    if (distance < 10) {  
        if (!this.isChasing) {
            this.isChasing = true;
			this.go = true;
        }
        this.faceToCamera();
        this.move();
    } else {  
        if (this.isChasing) {
            this.isChasing = false;
            this.go = false;
        }
    }

    if ( distance > 15) { 
        this.returnToOrigin();
    }
  }

	returnToOrigin() {
		if (Date.now() - this.lastReturnTime < this.returnCooldown) return;
		
		console.log(`exceeding 15m, robot back to origin at (${this.obj.object3D.position.x}, ${this.obj.object3D.position.y}, ${this.obj.object3D.position.z})`);
		
		this.obj.setAttribute("position", this.initialPosition);
		this.lastReturnTime = Date.now();
		this.isChasing = false;
		this.go = false;
		
		this.dx = 0;
		this.dz = 0;
	}
  
	teleportPlayerToOrigin() {
		let player = this.camera;
		player.setAttribute("position", { x: 0, y: 2, z: 0 });

		this.isChasing = false;
		this.go = false;

		console.log("player back to origin");
		
		let soundCaught = document.getElementById("audioCaught");
		if (soundCaught) {
			soundCaught.components.sound.playSound();
		}

		let welcomeText = document.getElementById("welcomeText");

		welcomeText.setAttribute("opacity", "1");
		welcomeText.emit("fadeOut");
		
	}

  distanceTo(target) {
    let p1 = this.obj.object3D.position;
    let p2 = target.object3D.position;
    return Math.sqrt(
      (p2.x - p1.x) ** 2 +
      (p2.y - p1.y) ** 2 +
      (p2.z - p1.z) ** 2
    );
  }

  faceToCamera() {
    let robotPos = this.obj.object3D.position;
    let camPos = this.camera.object3D.position;

    let dx = camPos.x - robotPos.x;
    let dz = camPos.z - robotPos.z;
    let theta = Math.atan2(dx, dz);
    
    this.obj.setAttribute("rotation", {
      y: THREE.MathUtils.radToDeg(theta)
    });
  }

	move() {
		if (!this.go) return; 

		let camPos = this.camera.object3D.position;
		let robotPos = this.obj.object3D.position;
		
		let dx = camPos.x - robotPos.x;
		let dz = camPos.z - robotPos.z;
		let distance = Math.sqrt(dx ** 2 + dz ** 2);
		
		if (distance > 0) {
			let speed = 0.1;
			this.dx = (dx / distance) * speed;
			this.dz = (dz / distance) * speed;
		}
		
		this.obj.object3D.position.x += this.dx;
		this.obj.object3D.position.z += this.dz;
	}
	}