import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import TWEEN from 'tween.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// Create a frustum object based on the camera's projection matrix
const frustum = new THREE.Frustum();
const cameraViewProjectionMatrix = new THREE.Matrix4();

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// import * as THREE from 'three'
// import { GLTFLoader } from "https://unpkg.com/three@0.145.0/examples/jsm/loaders/GLTFLoader.js"; 
// import { TWEEN } from "https://unpkg.com/three@0.145.0/examples/jsm/libs/tween.module.min.js";
// import { DRACOLoader } from 'https://unpkg.com/three@0.145.0/examples/jsm/loaders/DRACOLoader.js'
// import { RGBELoader } from 'https://unpkg.com/three@0.145.0/examples/jsm/loaders/RGBELoader.js';


//// DRACO LOADER TO LOAD DRACO COMPRESSED MODELS FROM BLENDER
const dracoLoader = new DRACOLoader()
const loader = new GLTFLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
dracoLoader.setDecoderConfig({ type: 'js' })
loader.setDRACOLoader(dracoLoader)

const gltfLoader = new GLTFLoader()

/**
 * Debug
 */
// const gui = new dat.GUI()
// gui.hide();

const parameters = {
    materialColor: '#f0ff7e'
}

// gui
//     .addColor(parameters, 'materialColor')
//     .onChange(() =>
//     {
//         material.color.set(parameters.materialColor)
//         particlesMaterial.color.set(parameters.materialColor)
//     })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x191919)

const light = new THREE.PointLight( 0xffff00, 1, 100 );
light.position.set(0, 12, 8 );
scene.add( light );
light.castShadow = true;
light.shadow.mapSize.width = 512;  
light.shadow.mapSize.height = 512; 
light.shadow.camera.near = 1;       
light.shadow.camera.far = 20;      
light.shadow.bias = -0.001;

//point light helper
const helper = new THREE.PointLightHelper( light, 1 );
scene.add( helper );

/////////////////////////////////////////////////////////////////////////
///// CREATING THE FLOOR
const geometry = new THREE.PlaneGeometry( 80, 80 );
const material = new THREE.ShadowMaterial( {color: 0x000000, side: THREE.DoubleSide, opacity: 0.5} );
const plane = new THREE.Mesh( geometry, material );
scene.add(plane);
plane.receiveShadow = true
plane.rotation.x = -Math.PI /2


/////////////////////////////////////////////////////////////////////////
///// LOADING THE TEXTURE FOR THE ENVIRONMENT
new RGBELoader()
    .load( 'https://cdn.glitch.global/df35b9e1-0fa8-49d1-b430-bed29251dfb5/gem_2.hdr?v=1675257556766', function ( texture ) {

      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
} );



// Objects
const objectsDistance = 7

let model
loader.load('https://cdn.glitch.global/84b42a01-59de-4a46-a133-517eb21aee3c/threejs_logo.glb?v=1675285403141', function (gltf) {

    scene.add(gltf.scene)
  
    gltf.scene.traverse((obj) => {
      
        if (obj.isMesh) {
          obj.castShadow = true
          obj.receiveShadow = true
          model = obj
          model.position.set(0, -0.6, 2)
        }
    })
})

function loadGLBModel(url) {
  return new Promise((resolve, reject) => {
    gltfLoader.load(url, resolve, undefined, reject);
  });
}

const meshGroup0 = new THREE.Group()
loadIconObject("/objects/permission.glb",meshGroup0,[0, -0.6, 0]);
meshGroup0.name = "project0"

const meshGroup1 = new THREE.Group()
loadIconObject("/objects/entoraj.glb",meshGroup1,[0, -0.6, 0]);
meshGroup1.name = "project1"

const meshGroup2 = new THREE.Group()
loadIconObject("/objects/hero.glb",meshGroup2,[0, -0.6, 0]);
meshGroup2.name = "project2"

const meshGroup3 = new THREE.Group()
loadIconObject("/objects/statefarm.glb",meshGroup3,[0, -0.6, 0]);
meshGroup3.name = "project3"


meshGroup0.position.x = - objectsDistance * -1
meshGroup1.position.x = - objectsDistance * 0
meshGroup2.position.x = - objectsDistance * 1
meshGroup3.position.x = - objectsDistance * 2


scene.add(meshGroup0,meshGroup1, meshGroup2, meshGroup3)

var sectionMeshes = [ meshGroup0, meshGroup1, meshGroup2, meshGroup3 ]  

/**
 * Lights
 */

// Ambient light
// const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
// scene.add(ambientLight)

// Directional light Top Right
// const directionalLightTopRight = new THREE.DirectionalLight('#b9d5ff', 1)
// directionalLightTopRight.position.set(0.5, -0.25, 4)

// const target = new THREE.Vector3(0, 0, 0); // Set the new target coordinates
// directionalLightTopRight.target.position.copy(target);
// scene.add(directionalLightTopRight);

// // Directional light Helper
// // const directionalLightHelperTop = new THREE.DirectionalLightHelper(directionalLightTopRight, 0.2);
// // scene.add(directionalLightHelperTop)

// //Directional light Top Left
// const directionalLightTopLeft = new THREE.DirectionalLight('#b9d5ff', 1)
// directionalLightTopLeft.position.set(-0.5, -0.25, 4)


// directionalLightTopLeft.target.position.copy(target);
// scene.add(directionalLightTopLeft);


// Directional light Helper
// const directionalLightHelperTopLeft = new THREE.DirectionalLightHelper(directionalLightTopLeft, 0.2);
// scene.add(directionalLightHelperTopLeft) 


/**
 * Sizes
 */
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 4 //4
scene.add(camera)


const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, powerPreference: "high-performance" }) // turn on antialias
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) //set pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight) // make it full screen
renderer.toneMapping = THREE.LinearToneMapping
renderer.toneMappingExposure = 1.2
renderer.shadowMap.enabled = true; // Needs to be enabled
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


// const renderer = new THREE.WebGLRenderer({
//     canvas: canvas,
//     powerPreference: "high-performance",
// })

// renderer.setSize(sizes.width, sizes.height)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.antialias = true;



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

    // // Animate meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.y += deltaTime * .6
    }

    if(model){
      model.rotation.y += deltaTime * .6

    }
  
    TWEEN.update();

    // Render
    renderer.render(scene, camera)

    controls.update(); 


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

    gltfLoader.load(
        fileLocation,
        (gltf) => {
            var object = gltf.scene;
            
            object.position.set(positionArray[0], positionArray[1], positionArray[2])
            groupName.add(object)
    })


}


function loadIconObjectNEW(fileLocation){

  gltfLoader.load(
      fileLocation,
      (gltf) => {
          var object = gltf.scene;
          console.log(object)
          return object;
  })


}

  function moveItems(array, up) {
    if (up) {
      const lastItem = array.pop();
      array.unshift(lastItem);
    } else {
      const firstItem = array.shift();
      array.push(firstItem);
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
      meshGroup0.scale.set(1.75,1.75,1.75)
      meshGroup1.scale.set(1.75,1.75,1.75)
      meshGroup2.scale.set(1.75,1.75,1.75)
      meshGroup3.scale.set(1.75,1.75,1.75)

    }
  }
    
  function isMobileSize() {
    return window.innerWidth < 900;
  }

  
function showNextButton(show){
  if(show){
    document.getElementById("next-button").style.display = "block";
  }else{
    document.getElementById("next-button").style.display = "none";
  } 
}


  const ovalButton = document.querySelector('.oval-button');
  
  // Add an event listener for the "click" event
  ovalButton.addEventListener('click', function (){
    manualNextProject();
  });
  
  // Function to handle the click event
  function manualNextProject() {

    var xPosition = 0;

    xPosition = 7;
    currentSection++;
  
    // move top most mesh instantly to the bottom.
    sectionMeshes[0].position.x = sectionMeshes[sectionMeshes.length - 1].position.x - xPosition;
    sectionMeshes = moveItems(sectionMeshes, false)
  
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
