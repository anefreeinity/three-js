import getPhongMaterial from "../material/BlinnPhong";
import makeTextSprite from "../material/text/Text";

export default function Panel(
  THREE,
  scene,
  nozRows = 4,
  noOfNoz = 5,
  width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.65
) {
  nozRows--;
  let textSize = height * 0.7;
  let xMin = -width / 2;
  let xMax = width / 2;

  let yMin = (-height * 0.8) / 2;
  let yMax = height / 2;

  let zMin = 0;
  let zMax = height * 0.2;
  let zNoz = zMax * 0.5;

  let nodeRadius = height * 0.01;
  let nozzleRadius = height * 0.012;

  let panelGroup = new THREE.Group();
  panelGroup.name = "Panel";
  panelGroup.position.x = -width * 0.05;
  panelGroup.position.y = -height * 0.1;

  drawPipeLine(
    THREE,
    panelGroup,
    [
      new THREE.Vector3(-width / 2, -height / 2, 0),
      new THREE.Vector3(-width / 2, height / 2, 0),
    ],
    0x691515,
    "ml",
    textSize
  );

  let nodeCounter = 1;
  drawPipeRows();
  panelGroup.rotation.x = -Math.PI / 2.35;
  panelGroup.rotation.z = Math.PI / 3;
  scene.add(panelGroup);

  function drawPipeRows() {
    let yInterval = (yMax + -1 * yMin) / nozRows;
    let currYInterval = yMax;
    for (let s = 0; s <= nozRows; s++) {
      let selectionLabel = `s${s + 1}`;
      let rowLabel = `r${s + 1}`;
      drawPipeLine(
        THREE,
        panelGroup,
        [
          new THREE.Vector3(xMin, currYInterval, zMin),
          new THREE.Vector3(xMin, currYInterval, zMax),
        ],
        0x691515,
        selectionLabel,
        textSize
      );

      drawNodes(
        THREE,
        panelGroup,
        nodeRadius,
        xMin,
        currYInterval,
        zMin,
        `n${nodeCounter++}`,
        textSize
      );
      drawNodes(
        THREE,
        panelGroup,
        nodeRadius,
        xMin,
        currYInterval,
        zMax,
        `n${nodeCounter++}`,
        textSize
      );

      drawPipeLine(
        THREE,
        panelGroup,
        [
          new THREE.Vector3(xMin, currYInterval, zMax),
          new THREE.Vector3(xMax, currYInterval, zMax),
        ],
        0x691515,
        rowLabel,
        textSize
      );

      drawNozzles(s, currYInterval);

      currYInterval -= yInterval;
    }
  }

  function drawNozzles(s, currYInterval) {
    let xInterval = width / noOfNoz;
    let currXInterval = xMax;
    for (let n = 0; n < noOfNoz; n++) {
      let nozzlePipeLabel = `np${n + 1}r${s + 1}`;
      let nozzleLabel = `n${n + 1}r${s + 1}`;
      drawPipeLine(
        THREE,
        panelGroup,
        [
          new THREE.Vector3(currXInterval, currYInterval, zMax),
          new THREE.Vector3(currXInterval, currYInterval, zNoz),
        ],
        0x0000ff,
        nozzlePipeLabel,
        textSize
      );
      drawNodes(
        THREE,
        panelGroup,
        nodeRadius,
        currXInterval,
        currYInterval,
        zMax,
        `n${nodeCounter++}`,
        textSize
      );
      drawNodes(
        THREE,
        panelGroup,
        nozzleRadius,
        currXInterval,
        currYInterval,
        zNoz,
        nozzleLabel,
        textSize,
        0x61edc8
      );
      currXInterval -= xInterval;
    }
  }
}

function drawPipeLine(
  THREE,
  panelGroup,
  points,
  color = 0x0000ff,
  label = "A",
  size = 1000
) {
  const material = new THREE.LineBasicMaterial({
    color: color,
  });
  //   console.log(material);
  material.linewidth = 10.0;

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);

  var spritey = makeTextSprite(THREE, label, size);

  let x = (points[0].x + points[1].x) / 2;
  let y = (points[0].y + points[1].y) / 2;
  let z = (points[0].z + points[1].z) / 2;

  spritey.position.set(x + 0.06, y + 0.06, z + 0.06);
  line.add(spritey);
  line.userData = { spritey: spritey, color: color, isClicked: false };

  panelGroup.add(line);
}

function drawNodes(
  THREE,
  panelGroup,
  rad = 0.05,
  x = 0,
  y = 0,
  z = 0,
  label = "A",
  size = 1000,
  color = 0xb9c3c7
) {
  const geometry = new THREE.SphereGeometry(
    rad,
    32,
    16,
    0,
    Math.PI * 2,
    0,
    Math.PI
  );
  const material = getPhongMaterial(THREE, color);
  const sphear = new THREE.Mesh(geometry, material);
  sphear.position.set(x, y, z);

  var spritey = makeTextSprite(THREE, label, size);
  spritey.position.set(0, 2 * rad + 0.06, rad + 0.06);
  sphear.add(spritey);
  sphear.userData = { spritey: spritey, color: color, isClicked: false };
  panelGroup.add(sphear);
}

export function removeLabel(scene) {
  if (scene.children.length === 0) return;
  for (let sChild of scene.children) {
    if (sChild.type === "Group" && sChild.name === "Panel") {
      if (sChild.children.length === 0) return;
      for (let gChild of sChild.children) {
        if (gChild.children.length === 0) continue;
        if (gChild.userData.spritey) {
          gChild.remove(gChild.userData.spritey);
        }
      }
    }
  }
}

export function addLabel(scene) {
  if (scene.children.length === 0) return;
  for (let sChild of scene.children) {
    if (sChild.type === "Group" && sChild.name === "Panel") {
      if (sChild.children.length === 0) return;
      for (let gChild of sChild.children) {
        if (gChild.userData.spritey) {
          gChild.add(gChild.userData.spritey);
        }
      }
    }
  }
}
