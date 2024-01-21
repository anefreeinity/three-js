export default function getDirectLight(THREE, scene, x = 0, y = 0, z = 5) {
  const directLight = new THREE.DirectionalLight(0xffffff);
  directLight.position.set(x, y, z).normalize();
  scene.add(directLight);
}
