export default function rayCasterUtil(
  event,
  pointer,
  raycaster,
  camera,
  scene
) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  pointer.z = 0;

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(scene.children);
  return intersects;
}
