class posSave{
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.scene = document.getElementById("scene");
    this.hint = document.getElementById("hint");
    this.camera = document.getElementById("camera");

    this.obj = document.createElement("a-gltf-model");
    this.obj.setAttribute("src", "#console");
	this.obj.setAttribute("position", `${this.x} ${this.y} ${this.z}`);
	this.obj.setAttribute("scale", "0.1 0.1 0.1");
	this.obj.setAttribute("class", "clickable");

	
    this.obj.addEventListener("model-loaded", () => {
      console.log("Machine Loaded Successfully!");
	  this.obj.setAttribute("rotation", "0 90 0");
    }); 

    this.isRecording = false;

    this.obj.addEventListener("click", ()=>{
      this.isRecording = true;
      this.record(); 
    });

    console.log(this.obj);
    this.scene.appendChild(this.obj);
  }

record() {
  if (this.isRecording) {
    let worldPos = new THREE.Vector3();
    this.camera.object3D.getWorldPosition(worldPos);

    this.hint.setAttribute("text", "value: Position Saved!; opacity: 1");
    this.hint.setAttribute("material", "opacity: 1");

    console.log("Emitting fadeOut");
    this.hint.emit("fadeOut");

    setTimeout(() => {
      this.hint.setAttribute("text", "value: ");
    }, 1100); 

    this.pos = { x: worldPos.x, y: worldPos.y, z: worldPos.z };
    console.log("Recorded Position:", this.pos);

    this.isRecording = false;
  }
}
  
  getPosition(){
    return this.pos; 
  }

}