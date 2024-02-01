export function getGuiController(gui, object, property) {
  for (var i = 0; i < gui.__controllers.length; i++) {
    var controller = gui.__controllers[i];
    if (controller.object === object && controller.property === property)
      return controller;
  }
  return null;
}
