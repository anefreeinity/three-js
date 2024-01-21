import getPhongMaterial from "../material/BlinnPhong";
import getPointLight from "../material/light/PointLight";

export default function cylinderSetup(
  THREE,
  scene,
  x = 0,
  y = 0,
  z = 0,
  radius = 1,
  length = 10,
  isopened = false
) {
  const geometry = new THREE.CylinderGeometry(
    radius,
    radius,
    length,
    64,
    64,
    isopened,
    0,
    Math.PI * 2
  );
  const material = getPhongMaterial(THREE);
  const cylinder = new THREE.Mesh(geometry, material);
  scene.add(cylinder);
  cylinder.position.set(x, y, z);

  getPointLight(THREE, scene, 3, 0, 5);

  scene.add(cylinder);
  return {
    cylinder,
    geometry,
    material,
  };
}

// export function sphearAnimation(sphear) {
//   sphear.rotation.x += 0.01;
//   sphear.rotation.y += 0.01;
//   sphear.rotation.z += 0.01;
// }
