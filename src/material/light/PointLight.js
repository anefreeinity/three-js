export default function getPointLight(THREE, scene, x = 0, y = 0, z = 5) {
  const pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(x, y, z).normalize();
  scene.add(pointLight);
}
