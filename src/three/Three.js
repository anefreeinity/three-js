import * as THREE from "three";
import { useEffect, useRef } from "react";
import WebGL from "three/addons/capabilities/WebGL.js";
import addControls from "../controls/Control";
import getStandardStyle from "../material/StandardMaterial";
import getPointLight from "../material/light/PointLight";
import getDirectLight from "../material/light/DirectLight";
import sphearSetup from "../shapes/Sphear";
import steelPipeSetup, { cpvcPipeSetup } from "../shapes/Pipe";
import cylinderSetup from "../shapes/Cylinder";
import getPhongMaterial from "../material/BlinnPhong";

const camDist = 10;
let INTERSECTED;

export default function Three() {
  const refContainer = useRef(null);

  useEffect(() => {
    setUp(refContainer);
  }, []);
  return <div ref={refContainer}></div>;
}

function setUp(refContainer) {
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x537dad);

  var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = camDist;

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  let controls = addControls(camera, renderer);

  refContainer.current && refContainer.current.appendChild(renderer.domElement);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  //   const sphear = sphearSetup(THREE, scene);
  //   steelPipeSetup(scene, -5, 1, 0);
  //   cpvcPipeSetup(scene, -5, -1, 0);
  //   const mesh = cylinderSetup(THREE, scene, 0, 0, 0, 0.5, 10, false);
  //   const pipe1 = mesh.cylinder;

  //   const cubeB = new THREE.Mesh(mesh.geometry, mesh.material);
  //   cubeB.position.set(-10, -10, 0);

  const geometry = new THREE.CylinderGeometry(
    5,
    5,
    10,
    64,
    64,
    false,
    0,
    Math.PI * 2
  );
  const material = getPhongMaterial(THREE);

  const pipeA = new THREE.Mesh(geometry, material);
  pipeA.position.set(10, 10, 0);

  const pipeB = new THREE.Mesh(geometry, material);
  pipeB.position.set(-10, -10, 0);

  //create a group and add the two cubes
  //These cubes can now be rotated / scaled etc as a group
  const group = new THREE.Group();
  group.add(pipeA);
  group.add(pipeB);

  scene.add(group);

  getStandardStyle(THREE, scene);
  getDirectLight(THREE, scene);

  var animate = function () {
    requestAnimationFrame(animate);
    controls.update();
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  };

  if (WebGL.isWebGLAvailable()) {
    animate();

    window.addEventListener("resize", () => {
      onWindowResize(camera, renderer);
    });
    window.addEventListener("pointermove", onPointerMove);
  } else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById("container").appendChild(warning);
  }

  function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      if (intersects[0].object !== INTERSECTED) {
        if (INTERSECTED)
          INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        INTERSECTED = intersects[0].object;
        INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
        INTERSECTED.material.color.setHex(0xffff00);
      }
    } else {
      if (INTERSECTED)
        INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
      INTERSECTED = null;
    }
  }
}

function onWindowResize(camera, renderer) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
