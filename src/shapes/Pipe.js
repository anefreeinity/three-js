import * as THREE from "three";
import getPhongMaterial from "../material/BlinnPhong";
import getPointLight from "../material/light/PointLight";

class CustomStraightLine extends THREE.Curve {
  constructor(scale = 1) {
    super();
    this.scale = scale;
  }

  getPoint(t, optionalTarget = new THREE.Vector3()) {
    const tx = t;
    const ty = t / 10;
    const tz = 0;

    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
  }
}

export default function steelPipeSetup(
  scene,
  x = 0,
  y = 0,
  z = 0,
  length = 10,
  radius = 0.5
) {
  const path = new CustomStraightLine(length);
  const geometry = new THREE.TubeGeometry(path, 100, radius, 50, true);
  const material = getPhongMaterial(THREE, 0xb5c0c9);
  getPointLight(THREE, scene, 0, 0, 0);
  const pipe = new THREE.Mesh(geometry, material);
  pipe.position.set(x, y, z);
  scene.add(pipe);
}

export function cpvcPipeSetup(
  scene,
  x = 0,
  y = 0,
  z = 0,
  length = 10,
  radius = 0.5
) {
  const path = new CustomStraightLine(length);
  const geometry = new THREE.TubeGeometry(path, 100, radius, 50, true);
  const material = getPhongMaterial(THREE, 0xc92c2c, 70, 0.8, 0.9, 0x3d3d3d);
  // getPointLight(THREE, scene, -10, 0, 0);
  const pipe = new THREE.Mesh(geometry, material);
  pipe.position.set(x, y, z);
  scene.add(pipe);
}
