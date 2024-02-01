import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default function addControls(perspectiveCamera, renderer) {
  let orbitControls = new OrbitControls(perspectiveCamera, renderer.domElement);
  //orbitControls.enablePan = true;
  orbitControls.enableDamping = true;
  orbitControls.dampingFactor = 0.05;
  orbitControls.screenSpacePanning = false;
  return orbitControls;
}
