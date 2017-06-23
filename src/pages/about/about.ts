import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ParticleProvider } from '../../providers/particle/particle';

/**
 * Generated class for the AboutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  gyro?: Vector;
  initialGyro?: Vector;

  constructor(public navCtrl: NavController, public navParams: NavParams, public particle: ParticleProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');

    if (this.particle.device) {
      let initialGyroX = await particle.getVariable("gyroX");
      let initialGyroY = await particle.getVariable("gyroY");
      let initialGyroZ = await particle.getVariable("gyroZ");
      this.initialGyro = new Vector(initialGyroX, initialGyroY, initialGyroZ);
      this.currentGyro = new Vector(initialGyroX, initialGyroY, initialGyroZ);

      this.particle.pollVariable("gyroX").subscribe(
        (value) => {
          if (typeof (value) === "number") {
            this.currentGyro.x = value;
          }
        },
        (error) => { console.log(`Error reading gyroX: ${error}`); },
        () => { console.log("Stopped polling gyroX"); }
      );
      this.particle.pollVariable("gyroY").subscribe(
        (value) => {
          if (typeof (value) === "number") {
            this.currentGyro.y = value;
          }
        },
        (error) => { console.log(`Error reading gyroY: ${error}`); },
        () => { console.log("Stopped polling gyroY"); }
      );
      this.particle.pollVariable("gyroZ").subscribe(
        (value) => {
          if (typeof (value) === "number") {
            this.currentGyro.z = value;
          }
        },
        (error) => { console.log(`Error reading gyroZ: ${error}`); },
        () => { console.log("Stopped polling gyroZ"); }
      );
    }
  }
}

class Vector {
  constructor(public x: number, public y: number, public z: number) { }

  dot(other: Vector) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  get magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  angleDifferenceFrom(other: Vector) {
    return Math.acos(dot(other) / (magnitude - other.magnitude));
  }
}
