import rayCasterUtil from "./RayCaster";

export function onHoverSelection(
  event,
  pointer,
  raycaster,
  camera,
  scene,
  INTERSECTED,
  selection = true
) {
  if (selection) hoverToSelect();
  function hoverToSelect() {
    const intersects = rayCasterUtil(event, pointer, raycaster, camera, scene);

    if (intersects.length > 0) {
      if (intersects[0].object !== INTERSECTED) {
        if (INTERSECTED) {
          if (!INTERSECTED.userData.isClicked) {
            INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
          }
        }
        INTERSECTED = intersects[0].object;
        INTERSECTED.currentHex = INTERSECTED.userData.color;
        if (!INTERSECTED.userData.isClicked) {
          INTERSECTED.material.color.setHex(0xffffff);
        }
        // console.log(intersects[0].object);
      }
    } else {
      if (INTERSECTED) {
        if (!INTERSECTED.userData.isClicked) {
          INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        }
      }
      INTERSECTED = null;
    }
  }

  return INTERSECTED;
}

export function onClickSelection(
  event,
  pointer,
  raycaster,
  camera,
  scene,
  selection = true
) {
  if (selection) clickToSelect();
  function clickToSelect() {
    const intersects = rayCasterUtil(event, pointer, raycaster, camera, scene);
    let color = 0xf20fc5;

    if (intersects.length > 0) {
      let obj = intersects[0].object;
      //console.log(obj);
      if (obj && obj.userData && obj.userData.isClicked) {
        obj.material.color.setHex(obj.userData.color);
        obj.userData.isClicked = false;
      } else {
        obj.material.color.setHex(color);
        obj.userData.isClicked = true;
      }
    }
  }
}

export function onPointDown(event, selectionBox, helper) {
  for (const item of selectionBox.collection) {
    if (item.userData && item.userData.color) {
      item.material.color.setHex(item.userData.color);
    } else {
      item.material.color.setHex(0x000000);
    }
  }

  selectionBox.startPoint.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1,
    0.5
  );

  if (helper.enabled === false) return;

  helper.isDown = true;
  helper.onSelectStart(event);
}

export function onPointMove(event, selectionBox, helper) {
  if (helper.isDown) {
    for (let i = 0; i < selectionBox.collection.length; i++) {
      if (
        selectionBox.collection[i].userData &&
        selectionBox.collection[i].userData.color
      ) {
        selectionBox.collection[i].material.color.setHex(
          selectionBox.collection[i].userData.color
        );
      } else {
        selectionBox.collection[i].material.color.setHex(0x000000);
      }
    }

    selectionBox.endPoint.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      0.5
    );

    const allSelected = selectionBox.select();

    for (let i = 0; i < allSelected.length; i++) {
      allSelected[i].material.color.setHex(0xf20fc5);
    }
  }

  if (helper.enabled === false) return;

  if (helper.isDown) {
    helper.onSelectMove(event);
  }
}

export function onPointUp(event, selectionBox, helper) {
  selectionBox.endPoint.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1,
    0.5
  );

  let allSelected = [];
  if (
    selectionBox.startPoint.x !== selectionBox.endPoint.x ||
    selectionBox.startPoint.y !== selectionBox.endPoint.y ||
    selectionBox.startPoint.z !== selectionBox.endPoint.z
  ) {
    allSelected = selectionBox.select();
  }

  for (let i = 0; i < allSelected.length; i++) {
    allSelected[i].material.color.setHex(0xf20fc5);
  }

  if (helper.enabled === false) return;

  helper.isDown = false;
  helper.onSelectOver();
}
