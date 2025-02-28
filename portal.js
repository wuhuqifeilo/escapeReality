class Portal {
  constructor(color) {

    this.color = color;
    this.scene = document.getElementById("scene");
    this.camera = document.getElementById("camera");
	this.bluePortalShot = document.getElementById("bluePortalShot");
	this.orangePortalShot = document.getElementById("orangePortalShot");

    this.obj = document.createElement("a-entity");
	this.obj.setAttribute("geometry", "primitive: circle;");
    this.obj.setAttribute("scale", "1 1.8 0.1");
    this.obj.setAttribute("radius", 0.7);
	this.obj.setAttribute("material", "side: double;");	
    this.obj.setAttribute("color", color);	
	
    if(color === "blue") {
      this.video = document.getElementById("bluePortalVid");
    }else if(color === "orange") {
      this.video = document.getElementById("orangePortalVid");
    }	
	
    if(this.video) {
      this.video.play();
      this.obj.setAttribute("material", `src: #${this.video.id}; side: double;`);
    }

    this.moving = true;

    let camPos = new THREE.Vector3();
    this.camera.object3D.getWorldPosition(camPos);

    let rotDeg = this.camera.getAttribute("rotation");
    let rotY = THREE.MathUtils.degToRad(rotDeg.y); 
    let rotX = THREE.MathUtils.degToRad(rotDeg.x); 

    let spawnDist = 1.0;           
    let px = camPos.x - spawnDist * Math.sin(rotY);  
    let py = camPos.y;
    let pz = camPos.z - spawnDist * Math.cos(rotY);

    this.obj.object3D.position.set(px, py, pz);

    let degX = rotDeg.x;
    let degY = rotDeg.y;
    this.obj.setAttribute("rotation", { x: degX, y: degY, z: 0 });

    this.scene.appendChild(this.obj);

    let speed = 0.2; 
    let cosX = Math.cos(rotX);
    this.dx = -Math.sin(rotY) * cosX * speed;
    this.dy =  Math.sin(rotX) * speed;
    this.dz = -Math.cos(rotY) * cosX * speed;
  }

	shoot() {
	  if (!this.moving) return;
	  let p = this.obj.object3D.position;
	  p.x += this.dx;
	  p.y += this.dy;
	  p.z += this.dz;
	  this.checkCollision();
	}
  

  checkCollision(){
	  
    let planes = this.scene.querySelectorAll("a-plane");
    for (let i = 0; i < planes.length; i++) {
      let plane = planes[i];
      if (this.isColliding(this.obj, plane)){
        this.moving = false;
        this.dx = 0;
        this.dy = 0;
		this.dz = 0;
        let rot = plane.getAttribute("rotation");

		this.xDeg = rot.x;
		this.yDeg = rot.y;
		this.zDeg = rot.z;
        this.obj.setAttribute("rotation", {x:this.xDeg, y:this.yDeg, z:this.zDeg});
		
        return; 

      }
    }
	
	let boxs = this.scene.querySelectorAll("a-box");
    for (let i = 0; i < boxs.length; i++) {
      let box = boxs[i];
	  
	  if (box.classList.contains("ignore-portal")) {
            continue;
        }
		
      if (this.isColliding(this.obj, box)){
        this.moving = false;
        this.dx = 0;
        this.dy = 0;
        this.dz = 0;
		
	    let rot = box.getAttribute("rotation");
		this.xDeg = rot.x;
		this.yDeg = rot.y;
		this.zDeg = rot.z;
        this.obj.setAttribute("rotation", {x:this.xDeg, y:this.yDeg, z:this.zDeg});
        return; 
	  }
    }
  }
  
  
	isColliding(portalObj, targetObj){

	  let centerP = new THREE.Vector3();
	  portalObj.object3D.getWorldPosition(centerP);

	  let bbox = new THREE.Box3().setFromObject(targetObj.object3D);
	  
	  bbox.expandByScalar(0.2);

	  return bbox.containsPoint(centerP);
	}

	  removeFromScene(){
		if (this.obj && this.obj.parentNode) {
		  this.obj.parentNode.removeChild(this.obj);
		}
	  }
	  
}


function distance(obj1, obj2) {
  let p1 = obj1.object3D.position;
  let p2 = obj2.object3D.position;
  let dx = p1.x - p2.x;
  let dy = p1.y - p2.y;
  let dz = p1.z - p2.z;
  return Math.sqrt(dx*dx + dy*dy + dz*dz);
}
