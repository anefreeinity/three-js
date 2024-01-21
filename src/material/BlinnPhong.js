export default function getPhongMaterial(
  THREE,
  color = 0xb9c3c7,
  shininess = 100,
  reflectivity = 1,
  refractionRatio = 0.98,
  specular = 0xbababa
) {
  return new THREE.MeshPhongMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(0x000000),
    specular: new THREE.Color(specular),
    shininess: shininess,
    // flatShading: true,
    reflectivity: reflectivity,
    refractionRatio: refractionRatio,
    combine: THREE.MultiplyOperation,
  });
}
