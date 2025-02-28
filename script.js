let scene, cam, robot, posSaveMachine, trophyModel, machineClicked;
let currentBluePortal = null;
let currentOrangePortal = null;
let collisionCooldown = false;

let lastTeleportTime = 0;
let cd = 2100; 


window.onload = function(){
  scene = document.querySelector("a-scene");
  cam   = document.getElementById("camera");
  machineClicked = document.getElementById("machineClicked");
  trophyModel = document.querySelector('#trophyModel');
  trophyModel.addEventListener("model-loaded", function(){
		trophyModel.setAttribute("static-body", { shape: "box" });
		trophyModel.setAttribute("class", "clickable");
		trophyModel.setAttribute("material", "color: gold; emissive: #555555; emissiveIntensity: 0.5;");
		trophyModel.object3D.traverse((node) => {
			if (node.isMesh && node.material) {
				node.material.metalness = 0.3;  
				node.material.roughness = 0.9;  
				node.material.needsUpdate = true;
			}	
		});
	});
		
  trophyModel.addEventListener("click", function(){
	  if(trophyModel){
		  showWinText();
	  }
  });
    


	
  scene.addEventListener("loaded", () => {
    console.log("robot loaded");
    robot = new Robot(-1, 8, 65, cam); 
	posSaveMachine = new posSave(47.5, 8, -5);
  });



  window.addEventListener("keydown", (e)=>{
  
  
    if(e.key === "v"){
      if(currentBluePortal){
        currentBluePortal.removeFromScene();
        currentBluePortal = null;
      }
      currentBluePortal = new Portal("blue");
      let fireBlue = document.getElementById("audioBlue");
      fireBlue.components.sound.playSound();
    }
    if(e.key === "b"){
      if(currentOrangePortal){
        currentOrangePortal.removeFromScene();
        currentOrangePortal = null;
      }
      currentOrangePortal = new Portal("orange");
      let fireOrange = document.getElementById("audioOrange");
      fireOrange.components.sound.playSound();
    }
	
	if (e.key === "t" && posSaveMachine) {
	  let pos = posSaveMachine.getPosition();
	  if (pos) {
		cam.setAttribute("position", { x: pos.x, y: pos.y, z: pos.z });
		console.log("Teleported to:", pos);
	  }
	}
		
  });
  
  loop();

}


function updateCooldownDisplay() {
  let cooldownDisplay = document.getElementById("cooldownDisplay");
  let currentTime = Date.now();
  let delta = currentTime - lastTeleportTime; 

  if (delta <= cd) {

    let remainMs = cd - delta;    
    let remainSec = (remainMs / 1000).toFixed(1);

    cooldownDisplay.textContent = `Cooldown: ${remainSec}s`;
  } else {
    cooldownDisplay.textContent = "Teleport Ready";
  }
}

function loop(){
  if(currentBluePortal) {
    currentBluePortal.shoot();
  }
  if(currentOrangePortal) {
    currentOrangePortal.shoot();
  }
  
  updateCooldownDisplay();
  
  let camPos = cam.getAttribute("position");

  teleportCheck(currentBluePortal, currentOrangePortal);
  

  if (robot) {
    robot.chase();
  }else {
    console.warn("Robot is not initialized yet.");
  }

  
  requestAnimationFrame(loop);
}

function teleportCheck(portal1, portal2) {
  if (!portal1 || !portal2) return;      
  if (portal1.moving || portal2.moving) return; 
  let transition = document.getElementById("transition");

  let now = Date.now();
  if (now - lastTeleportTime < cd) return;

  let camPos = new THREE.Vector3();
  cam.object3D.getWorldPosition(camPos);

  let p1p = new THREE.Vector3();
  let p2p = new THREE.Vector3();
  portal1.obj.object3D.getWorldPosition(p1p);
  portal2.obj.object3D.getWorldPosition(p2p);

  if (camPos.distanceTo(p1p) < 2) {
    teleportTo(p2p);
  } else if (camPos.distanceTo(p2p) < 2) {
    teleportTo(p1p);
  }
}


function teleportTo(targetPosition) {
  let transition = document.getElementById("transition");

  transition.setAttribute("material", "opacity: 1");
  cam.setAttribute("wasd-controls", "enabled: false");
  cam.setAttribute("position", { x: targetPosition.x, y: targetPosition.y, z: targetPosition.z });

  lastTeleportTime = Date.now();

  setTimeout(() => {
    transition.setAttribute("material", "opacity: 0");
    cam.setAttribute("wasd-controls", "enabled: true");
  }, 200);

  let teleSound = document.getElementById("audioTeleport");
  teleSound.components.sound.playSound();
}

function distance(obj1, obj2) {
  let p1 = new THREE.Vector3();
  let p2 = new THREE.Vector3();
  obj1.object3D.getWorldPosition(p1);
  obj2.object3D.getWorldPosition(p2);
  return p1.distanceTo(p2);
}




function showWinText() {
  let soundApplause = document.getElementById("audioApplause");
  if (soundApplause) {
    soundApplause.components.sound.playSound();
  }

  let winText = document.getElementById("winText");

  winText.setAttribute("text", "opacity", 1);

  winText.setAttribute("visible", "true");
}

