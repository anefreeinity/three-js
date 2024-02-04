class WaterDrip {
  constructor(THREE, sphear, height = 2, radius = 0.5) {
    this.THREE = THREE;
    this.sphear = sphear;
    this.isRainAdded = false;
    this.color = 0x5395d4;
    this.size = height * 0.8;
    this.i = 40;
    this.j = 20;
    this.centerPoint = new this.THREE.Vector3().applyMatrix4(
      this.sphear.matrixWorld
    );
    this.height = height;
    this.radius = radius;
    this.delHFactor = this.height / this.i;
    this.thetha = Math.atan(this.height / this.radius);
    this.delR = 0;
    this.delH = 0;
    this.rainDrops = [];
    this.rainDropsCurrentPos = [];
    this.raindropVelocity = [];

    for (let i = 1; i <= this.i; i++) {
      this.delH = this.delHFactor * i;
      this.delR = this.delH / Math.tan(this.thetha);
      let currentCP = new this.THREE.Vector3(
        this.centerPoint.x,
        this.centerPoint.y,
        this.centerPoint.z - this.delH
      );

      for (let j = 1; j <= this.j; j++) {
        let rainDrop = new this.THREE.Vector3(
          this.generateRandom(currentCP.x + this.delR, currentCP.x - this.delR),
          this.generateRandom(currentCP.y + this.delR, currentCP.y - this.delR),
          currentCP.z
        );
        this.rainDrops.push(rainDrop);
        this.raindropVelocity.push(0);
        this.rainDropsCurrentPos.push(rainDrop);
      }
    }

    this.rainGeo = new this.THREE.BufferGeometry().setFromPoints(
      this.rainDrops
    );

    this.rainMaterial = new this.THREE.PointsMaterial({
      color: this.color,
      size: this.size,
      transparent: true,
    });

    this.rain = new this.THREE.Points(this.rainGeo, this.rainMaterial);
    this.rain.userData = { isAnimation: true };
    this.rain.visible = false;
    //this.sphear.add(this.rain);
  }

  generateRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  dripWater() {
    if (!this.isRainAdded) {
      this.sphear.add(this.rain);
      this.isRainAdded = true;
    }

    this.rainDropsCurrentPos = [];
    for (let i = 0; i < this.rainDrops.length; i++) {
      let currentPoint = new this.THREE.Vector3(
        this.rainDrops[i].x,
        this.rainDrops[i].y,
        this.rainDrops[i].z
      );
      let currentVelocity = this.raindropVelocity[i];
      currentPoint.z -= currentVelocity;
      if (Math.abs(currentPoint.z) > this.height) {
        this.raindropVelocity[i] = 0;
        this.rainDropsCurrentPos.push(this.rainDrops[0].clone());
        continue;
      }
      currentVelocity += 0.01;
      this.raindropVelocity[i] = currentVelocity;
      this.rainDropsCurrentPos.push(currentPoint);
    }

    this.rainGeo.setFromPoints(this.rainDropsCurrentPos);
  }
}

export { WaterDrip };
