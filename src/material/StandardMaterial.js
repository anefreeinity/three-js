export default function getStandardStyle(THREE, scene) {
  const ambientLight = new THREE.AmbientLight(0x404040);
  //   scene.fog = new THREE.Fog();
  //   scene.fog.Color = new THREE.Color(0x9b313c);
  scene.add(ambientLight);
}
