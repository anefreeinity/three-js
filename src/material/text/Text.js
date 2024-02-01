export default function makeTextSprite(
  THREE,
  message,
  size = 5,
  opts,
  category = "",
  attenuateSize = true
) {
  const aspect = window.innerWidth / window.innerHeight;
  const factor = 0.25;
  const parameters = opts || {};
  const fontface = parameters.fontface || "Arial";
  const fontsize = parameters.fontsize || 30;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = "400";
  // canvas.height = canvas.width / aspect;
  canvas.height = "420";
  let context = canvas.getContext("2d");
  context.font = "Bold " + fontsize + "px " + fontface;
  context.lineWidth = 1;

  // text color
  context.fillStyle = parameters.color;
  // context.fillStyle = 'black';
  // context.fillStyle = "rgba(155,0,200,0.95)";
  // context.textAlign = "center";
  // context.textBaseline = "middle";

  if (message instanceof Array) {
    for (var i = 0; i < message.length; i++) {
      context.fillText(message[i], 0, fontsize + i * 30);
    }
  } else {
    context.fillText(message + "", 0, 30);
  }

  // var texture2 = createTexture(canvas);
  // texture2.needsUpdate = true;

  const texture = new THREE.Texture(canvas);
  // texture.wrapS = THREE.RepeatWrapping;
  // texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    // color: 0xffffff,
    // sizeAttenuation: false,
    // useScreenCoordinates: false,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(spriteMaterial);

  sprite.scale.set(1 * size * factor, 1 * size * factor, 1);
  // sprite.scale.set(2, 2/0.5, 1.0);
  sprite.center.set(0, 1);
  sprite["class"] = category;
  sprite.renderOrder = 0;
  return sprite;
}
