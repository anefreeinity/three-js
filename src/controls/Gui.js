export function getGuiController(gui, object, property) {
  for (var i = 0; i < gui.__controllers.length; i++) {
    var controller = gui.__controllers[i];
    if (controller.object === object && controller.property === property)
      return controller;
  }
  return null;
}

export function disabled(controller) {
  controller.__li.style =
    "opacity: 0.8; filter: grayscale(100%) blur(0.5px); pointer-events: none;";
}

export function enabled(controller) {
  controller.__li.style =
    "opacity: 1; filter: grayscale(0%) blur(0px); pointer-events: auto;";
}
