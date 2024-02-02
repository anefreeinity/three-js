import { drawPipeLine } from "./Panel";

class PanelElementTree {
  constructor(element, animationFactor) {
    this.element = element;
    this.animationFactor = animationFactor;
    this.animationLine = null;
    this.color = 0xfc03cf;
    this.count = 0;
    this.lineFactor = 0.03;
    this.isCompleted = false;
    this.children = [];
  }

  insert(element) {
    let child = new PanelElementTree(element, this.animationFactor * 0.7);
    this.children.push(child);
    return child;
  }

  isPointOnLineAndBetweenPoints(pointA, pointB, pointToCheck) {
    if (!this.isPointOnLine(pointA, pointB, pointToCheck)) {
      return false;
    }

    let dx = pointB.x - pointA.x;
    let dy = pointB.y - pointA.y;
    let dz = pointB.z - pointA.z;

    if (Math.abs(dx) >= Math.abs(dy) && Math.abs(dx) >= Math.abs(dz)) {
      if (dx > 0) {
        return pointA.x <= pointToCheck.x && pointToCheck.x <= pointB.x;
      } else {
        return pointB.x <= pointToCheck.x && pointToCheck.x <= pointA.x;
      }
    } else if (Math.abs(dy) >= Math.abs(dx) && Math.abs(dy) >= Math.abs(dz)) {
      if (dy > 0) {
        return pointA.y <= pointToCheck.y && pointToCheck.y <= pointB.y;
      } else {
        return pointB.y <= pointToCheck.y && pointToCheck.y <= pointA.y;
      }
    } else {
      if (dz > 0) {
        return pointA.z <= pointToCheck.z && pointToCheck.z <= pointB.z;
      } else {
        return pointB.z <= pointToCheck.z && pointToCheck.z <= pointA.z;
      }
    }
  }

  isPointOnLine(pointA, pointB, pointToCheck) {
    var c = new this.element.THREE.Vector3();
    c.crossVectors(
      pointB.clone().sub(pointToCheck),
      pointA.clone().sub(pointToCheck)
    );
    return !c.length();
  }

  animation(flag = false) {
    if (!flag) return;

    let startPoint;
    let newEndVect;

    startPoint = this.element.startPoint.clone();
    let normalizeVect = this.element.endPoint
      .clone()
      .sub(this.element.startPoint.clone())
      .normalize();
    newEndVect = startPoint
      .clone()
      .add(
        normalizeVect.clone().multiplyScalar(this.animationFactor * this.count)
      );

    if (
      this.isPointOnLineAndBetweenPoints(
        this.element.startPoint.clone(),
        this.element.endPoint.clone(),
        newEndVect.clone()
      )
    ) {
      if (this.animationLine) {
        this.element.panelGroup.remove(this.animationLine);
        this.animationLine = null;
      }

      let sp = new this.element.THREE.Vector3(
        startPoint.x - this.lineFactor,
        startPoint.y + this.lineFactor,
        startPoint.z + this.lineFactor
      );

      let ep = new this.element.THREE.Vector3(
        newEndVect.x - this.lineFactor,
        newEndVect.y + this.lineFactor,
        newEndVect.z + this.lineFactor
      );

      this.animationLine = drawPipeLine(
        this.element.THREE,
        this.element.panelGroup,
        [sp, ep],
        this.color
      );

      this.count++;
    } else {
      this.isCompleted = true;
    }

    for (let child of this.children) {
      if (
        this.isPointOnLineAndBetweenPoints(
          startPoint.clone(),
          newEndVect.clone(),
          child.element.startPoint.clone()
        )
      ) {
        child.animation(true);
      }
    }
  }

  removeAnimation() {
    if (this.animationLine) {
      this.element.panelGroup.remove(this.animationLine);
      this.animationLine = null;
      this.count = 0;
      this.isCompleted = false;
    }

    for (let child of this.children) {
      child.removeAnimation();
    }
  }

  isAnimationCompleted() {
    let temp = true;
    for (let child of this.children) {
      temp = temp && child.isAnimationCompleted();
    }
    return this.isCompleted && temp;
  }
}

export { PanelElementTree };
