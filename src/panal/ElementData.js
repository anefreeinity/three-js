class ElementData {
  constructor(
    THREE,
    panelGroup,
    points,
    line = null,
    sphear = null,
    waterDrip = null
  ) {
    this.THREE = THREE;
    this.panelGroup = panelGroup;
    this.startPoint = points[0];
    this.endPoint = points[1];
    this.line = line;
    this.sphear = sphear;
    this.waterDrip = waterDrip;
  }
}

export { ElementData };
