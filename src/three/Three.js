import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { GUI } from "dat.gui";
import { useEffect, useRef } from "react";
import {
  onClickSelection,
  onHoverSelection,
  onPointDown,
  onPointMove,
  onPointUp,
} from "../controls/Selection";
import addControls from "../controls/OrbitControlsUtil";
import Panel, { addLabel, removeLabel } from "../panal/Panel";
import { SelectionBox } from "../controls/drag-selection/SelectionBox";
import { SelectionHelper } from "../controls/drag-selection/SelectionHelper";
import { disabled, enabled, getGuiController } from "../controls/Gui";

let camDist = 10;
let INTERSECTED;
let selectionBox;
let helper;

class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

function MyThree() {
  const refContainer = useRef(null);
  useEffect(() => {
    setUp(refContainer);
  }, []);

  return <div ref={refContainer}></div>;
}

function setUp(refContainer) {
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcccccc);
  //scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

  var pCamera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    500
  );
  // const oCamera = new THREE.OrthographicCamera(
  //   window.innerWidth / -2,
  //   window.innerWidth / 2,
  //   window.innerHeight / 2,
  //   window.innerHeight / -2,
  //   -1000,
  //   1000
  // );
  const oCamera = new THREE.OrthographicCamera(
    32 / -2,
    32 / 2,
    18 / 2,
    18 / -2,
    -1000,
    1000
  );

  const camera = oCamera;
  camera.position.set(0, 0, camDist);
  camera.lookAt(0, 0, 0);
  camera.zoom = 1.5;
  // camera.receiveShadow = true;

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  let controls = addControls(camera, renderer);
  controls.target.set(0, 0, 0);

  refContainer.current && refContainer.current.appendChild(renderer.domElement);

  const raycaster = new THREE.Raycaster();
  raycaster.params.Line.threshold = 0.25;
  const pointer = new THREE.Vector3();

  let panleElements = Panel(THREE, scene, 4, 5, 16, 9);
  // Panel(THREE, scene);
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.AmbientLight(color, intensity);
  scene.add(light);
  const gui = new GUI();
  const color1 = 0xffffff;

  const light1 = new THREE.DirectionalLight(color1, intensity);
  light1.position.set(0, 10, 0);
  light1.target.position.set(-5, 0, 0);
  scene.add(light1);
  scene.add(light1.target);

  let planeSpecs = {
    Selection: false,
    DragToSelect: false,
    WaterFlowAnimation: false,
  };

  selectionBox = new SelectionBox(camera, scene);
  helper = new SelectionHelper(renderer, "selectBox");

  gui.add(planeSpecs, "Selection").onChange((value) => {
    if (value) {
      removeLabel(scene);
      disabled(getGuiController(gui, planeSpecs, "DragToSelect"));
      disabled(getGuiController(gui, planeSpecs, "WaterFlowAnimation"));
    } else {
      addLabel(scene);
      enabled(getGuiController(gui, planeSpecs, "DragToSelect"));
      enabled(getGuiController(gui, planeSpecs, "WaterFlowAnimation"));
    }
  });

  gui.add(planeSpecs, "DragToSelect").onChange((value) => {
    if (value) {
      removeLabel(scene);
      disabled(getGuiController(gui, planeSpecs, "Selection"));
      disabled(getGuiController(gui, planeSpecs, "WaterFlowAnimation"));
    } else {
      addLabel(scene);
      enabled(getGuiController(gui, planeSpecs, "Selection"));
      enabled(getGuiController(gui, planeSpecs, "WaterFlowAnimation"));
    }
  });

  gui.add(planeSpecs, "WaterFlowAnimation").onChange((value) => {
    if (value) {
      removeLabel(scene);
      disabled(getGuiController(gui, planeSpecs, "DragToSelect"));
      disabled(getGuiController(gui, planeSpecs, "Selection"));
    } else {
      addLabel(scene);
      enabled(getGuiController(gui, planeSpecs, "DragToSelect"));
      enabled(getGuiController(gui, planeSpecs, "Selection"));
    }
  });

  const intensity1 = 100;
  const light3 = new THREE.PointLight(0xffc0cb, intensity1);
  light3.position.set(0, 15, 0);
  scene.add(light3);

  let hasAnimationStarted = false;
  let hasAnimationEnded = false;
  var animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (planeSpecs.DragToSelect) {
      helper.enabled = true;
      controls.enabled = false;
    } else {
      helper.enabled = false;
      controls.enabled = true;
      controls.update();
    }

    if (planeSpecs.WaterFlowAnimation && !hasAnimationEnded) {
      //console.log("animate");
      panleElements.animation(true);
      hasAnimationStarted = true;
      hasAnimationEnded = panleElements.isAnimationCompleted();
    } else if (!planeSpecs.WaterFlowAnimation) {
      if (hasAnimationStarted) {
        panleElements.removeAnimation();
        hasAnimationStarted = false;
        hasAnimationEnded = false;
      }
    }
    //https://codepen.io/navin_moorthy/pen/qBWYORJ
  };

  if (WebGL.isWebGLAvailable()) {
    animate();
    window.addEventListener("resize", () => {
      onWindowResize(camera, renderer);
    });

    window.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerdown", pointerDown);
    window.addEventListener("pointerup", pointerUp);
    window.addEventListener("click", onClick);
  } else {
    const warning = WebGL.getWebGLErrorMessage();
    window.alert(JSON.stringify(warning));
  }

  function pointerDown(event) {
    if (planeSpecs.DragToSelect) {
      onPointDown(event, selectionBox, helper);
    }
  }

  function pointerMove(event) {
    if (planeSpecs.Selection) {
      INTERSECTED = onHoverSelection(
        event,
        pointer,
        raycaster,
        camera,
        scene,
        INTERSECTED,
        planeSpecs.Selection
      );
    } else if (planeSpecs.DragToSelect) {
      onPointMove(event, selectionBox, helper);
    }
  }

  function pointerUp(event) {
    if (planeSpecs.DragToSelect) {
      onPointUp(event, selectionBox, helper);
    }
  }

  function onClick(event) {
    console.log(scene);
    onClickSelection(
      event,
      pointer,
      raycaster,
      camera,
      scene,
      planeSpecs.Selection
    );
  }
}

function onWindowResize(camera, renderer) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

export default MyThree;
