import * as THREE from 'three'
import TWEEN from 'tween.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'


// import { GLTFLoader } from "https://unpkg.com/three@0.145.0/examples/jsm/loaders/GLTFLoader.js"; 
// import { TWEEN } from "https://unpkg.com/three@0.145.0/examples/jsm/libs/tween.module.min.js";
// import { DRACOLoader } from 'https://unpkg.com/three@0.145.0/examples/jsm/loaders/DRACOLoader.js'
// import { RGBELoader } from 'https://unpkg.com/three@0.145.0/examples/jsm/loaders/RGBELoader.js';



//// DRACO LOADER TO LOAD DRACO COMPRESSED MODELS FROM BLENDER
const dracoLoader = new DRACOLoader()
const gltfLoader = new GLTFLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
dracoLoader.setDecoderConfig({ type: 'js' })
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Debug
 */
// const gui = new dat.GUI()
// gui.hide();

const parameters = {
    materialColor: '#f0ff7e'
}

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color("lightgrey")


// Directional Light
const cameraLight = new THREE.DirectionalLight( "white", 0.75);
cameraLight.position.set(0.5, 0, 0.866);


const directionalLight = new THREE.DirectionalLight( "white", 0.1);
directionalLight.position.set(-2, 3, 0);

scene.add(directionalLight);

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;  
directionalLight.shadow.mapSize.height = 2048; 
directionalLight.shadow.camera.near = 1;       
directionalLight.shadow.camera.far = 20;      
directionalLight.shadow.bias = -0.001;
// Remove the default ambient light from the scene


// point light helper
// const helper = new THREE.DirectionalLightHelper( light, 100 );
// scene.add( helper );


//point light helper
// const helper = new THREE.DirectionalLightHelper( light, 50 );
// scene.add( helper );

/////////////////////////////////////////////////////////////////////////
///// CREATING THE FLOOR
const geometry = new THREE.PlaneGeometry( 80, 80 );
const material = new THREE.ShadowMaterial( {color: 0x000000, side: THREE.DoubleSide, opacity: 1} );
const plane = new THREE.Mesh( geometry, material );
scene.add(plane);
plane.receiveShadow = true
plane.rotation.x = -Math.PI /2


/////////////////////////////////////////////////////////////////////////
///// LOADING THE TEXTURE FOR THE ENVIRONMENT
// new RGBELoader()
//     .load( 'objects/test.hdr', function ( texture ) {

//       texture.mapping = THREE.EquirectangularReflectionMapping
//       scene.environment = texture;
// } );


// Objects
const objectsDistance = 7

let triangle
gltfLoader.load('https://cdn.glitch.global/84b42a01-59de-4a46-a133-517eb21aee3c/threejs_logo.glb?v=1675285403141', function (gltf) {

    scene.add(gltf.scene)
  
    gltf.scene.traverse((obj) => {
      
        if (obj.isMesh) {
          obj.castShadow = true
          obj.receiveShadow = true
          triangle = obj
          triangle.position.set(0, 2, 0)
          triangle.scale.set(0.5,0.5,0.5)
          meshGroup0.add(triangle)
          meshGroup3.add(triangle.clone())
        }
    })
})


const meshGroup0 = new THREE.Group()
const meshGroup1 = new THREE.Group()
const meshGroup2 = new THREE.Group()
const meshGroup3 = new THREE.Group()
meshGroup0.position.x =   objectsDistance * -1
meshGroup1.position.x =   objectsDistance * 0
meshGroup2.position.x =   objectsDistance * 1
meshGroup3.position.x =   objectsDistance * 2

var currentMesh = meshGroup1;

scene.add(meshGroup0,meshGroup1, meshGroup2, meshGroup3)
var sectionMeshes = [meshGroup0, meshGroup1, meshGroup2, meshGroup3]  


loadIconObject("/objects/cup.glb",meshGroup1,[0, 0.5, 0])
loadIconObject("/objects/test.glb",meshGroup2,[0, 1, 0]);




const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{

    mobileResize();

    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
// const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 10)
camera.position.x = 0
camera.position.y = 3
camera.position.z = 7
scene.add(camera)

camera.add(cameraLight)

// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true


// adding the buttons from javascript
document.addEventListener("DOMContentLoaded", function () {

  // Create the "Forward" button
  const forwardButton = document.createElement("div");
  forwardButton.id = "next-button-forward";
  forwardButton.className = "oval-button oval-button-forward";
  forwardButton.textContent = "Forward";

  // Create the "Backward" button
  const backwardButton = document.createElement("div");
  backwardButton.id = "next-button-backward";
  backwardButton.className = "oval-button oval-button-backward";
  backwardButton.textContent = "Backward";

  // Append the buttons to the <body> element
  document.body.appendChild(forwardButton);
  document.body.appendChild(backwardButton);


  // const forwardButton = document.querySelector('.oval-button-forward');
  
  // Add an event listener for the "click" event
  forwardButton.addEventListener('click', function (){
    manualNextProject(true);
  });
  
  // const backwardsButton = document.querySelector('.oval-button-backward');
  
  // Add an event listener for the "click" event
  backwardButton.addEventListener('click', function (){
    manualNextProject(false);
  });
  
});



/**
 * Renderer
 */
const container = document.createElement('div')
document.body.appendChild(container)
container.classList.add("threejs");
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" }) // turn on antialias
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) //set pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight) // make it full screen
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.5
renderer.shadowMap.enabled = true; // Needs to be enabled
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

container.appendChild(renderer.domElement) // add the renderer to html div



/**
 * Cursor
 */

const cursor = document.getElementById('cursor');
const cursorIconLock = document.getElementById('cursor-icon-lock');
const cursorIconUnlock = document.getElementById('cursor-icon-unlock');


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

// initial
mobileResize();

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.y += deltaTime * .2
    }
  
    TWEEN.update();

    // Render
    renderer.render(scene, camera)

    // controls.update(); 


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()




/**
 * Scroll
 */
let currentSection = 1



// click event for each object

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function loadIconObject(fileLocation, groupName,positionArray){

    gltfLoader.load(fileLocation, (gltf) => {
      var object = gltf.scene;
      object.traverse((obj) => {
          if (obj.isMesh) {
              obj.castShadow = true;
              // obj.receiveShadow = true;
          }
      });
      object.position.set(positionArray[0], positionArray[1], positionArray[2])
      groupName.add(object);
  });
}


  function moveItems(array, forward) {
    if (forward) {
      const firstItem = array.shift();
      array.push(firstItem);
    } else {
      const lastItem = array.pop();
      array.unshift(lastItem);
    }
    return array;
  }


  function mobileResize() {
    if(window.innerWidth < 900){
      meshGroup0.scale.set(1.25,1.25,1.25)
      meshGroup1.scale.set(1.25,1.25,1.25)
      meshGroup2.scale.set(1.25,1.25,1.25)
      meshGroup3.scale.set(1.25,1.25,1.25)

      
    }else{
      meshGroup1.scale.set(2,2,2)
      meshGroup2.scale.set(0.1,0.1,0.1)
      meshGroup3.scale.set(1,1,1)
    }
  }
    
  function isMobileSize() {
    return window.innerWidth < 900;
  }

  

  // Function to handle the click event
  function manualNextProject(forward) {

    
    var xPosition = forward ? -7 : 7;
    forward ? currentSection++ : currentSection--;
    currentMesh = sectionMeshes[currentSection];
    console.log(currentSection);

    if(forward){
      sectionMeshes[0].position.x = sectionMeshes[sectionMeshes.length - 1].position.x + 7;
    }else{
      sectionMeshes[sectionMeshes.length - 1].position.x = sectionMeshes[0].position.x - 7;
    }

    // sectionMeshes[0].position.x = sectionMeshes[sectionMeshes.length - 1].position.x - xPosition;
    sectionMeshes = moveItems(sectionMeshes, forward)
  
    for(const mesh of sectionMeshes){
      // console.log("position: " +  mesh.position.y);
    
        const targetPosition = new THREE.Vector3(mesh.position.x + xPosition,0, 0);
    
        // Set up the animation
        const duration = 1000; // Animation duration in milliseconds
    
        // Create a new Tween
        const tween = new TWEEN.Tween(mesh.position)
          .to(targetPosition, duration)
          .easing(TWEEN.Easing.Quadratic.InOut) // Choose the easing function for the animation
          .onUpdate(() => {
    
            // Render the scene after each update
            renderer.render(scene, camera);
          })
          .start(); // Start the animation
     }
  }


  // Objects follow the mouse movement

  // Add an event listener to track mouse movement

  // Add an event listener to track mouse movement
  // window.addEventListener('mousemove', onMouseMove);
  
  // function onMouseMove(event) {
  //   // Calculate the rotation angles based on mouse position
  //   const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  //   const mouseY = (event.clientY / window.innerHeight) * 2 - 1;
  
  //   // Apply the rotation to the object
  //   meshGroup1.rotation.y = mouseX * 1;
  //   meshGroup1.rotation.x = mouseY * .15;
  // }


// Define variables for mouse interaction
let isDragging = false;
let previousMousePosition = {
  x: 0,
  y: 0
};

// Add event listeners to track mouse interaction
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseup', onMouseUp);

// Function to handle mouse down event
function onMouseDown(event) {
  isDragging = true;
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  };
}

// Function to handle mouse move event
function onMouseMove(event) {
  if (isDragging) {
    const deltaMouse = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y
    };

    // Apply rotation based on mouse movement

    if(currentMesh){
      currentMesh.rotation.x += deltaMouse.y * 0.001; // Adjust rotation sensitivity as needed
      currentMesh.rotation.y += deltaMouse.x * 0.01;
    }

    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  }
}

// Function to handle mouse up event
function onMouseUp() {
  isDragging = false;
}