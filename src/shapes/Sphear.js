import getPhongMaterial from "../material/BlinnPhong";
import getPointLight from "../material/light/PointLight";

export default function sphearSetup(THREE, scene, x = 0, y = 0, z = 0) {
  const geometry = new THREE.SphereGeometry(
    1,
    42,
    20,
    0,
    Math.PI * 2,
    0,
    Math.PI
  );
  const material = getPhongMaterial(THREE);
  const sphear = new THREE.Mesh(geometry, material);
  sphear.userData.id = "geo";
  sphear.position.set(x, y, z);

  getPointLight(THREE, scene, 3, 0, 5);

  scene.add(sphear);
  return sphear;
}

export function sphearAnimation(sphear) {
  sphear.rotation.x += 0.01;
  sphear.rotation.y += 0.01;
  sphear.rotation.z += 0.01;
}
