import {
  Barometer
} from "barometer";
import {
  mean
} from "scientific";
import {
  units
} from "user-settings";

import {
  View,
  $at
} from "../lib/view";

export default class Altitude extends View {
  constructor(parent, callback) {
    const $ = $at(parent);
    this.callback = callback;
    this.label = $("#lblAltitude");
    this.labelUnits = $("#lblAltitudeUnits");
    this.renderLimit = 10;
    this._renderCount = 0;
    this._firstRun = true;
    this._approxFloorPa = 36.62293100066991;
    this._lastMean = 0;
    this._countUpwards = 2;
    this.runCount = 0;
  }

  processBarometer = () => {
    //console.log(`barometer: ${this.barometer.pressure}`);
    this.getAltitude();
    if (this._firstRun) {
      this._lastMean = this.barometer.pressure;
      this.barometer.stop();
      this.barometer = undefined;
      this.startBatchBarometer();
      this._firstRun = false;
    } else {
      this.detectDirectionOfTravel();
    }
  }

  detectDirectionOfTravel = () => {
    let currMean = mean(this.barometer.readings.pressure);
    //console.log(`last mean: ${this._lastMean} >> new mean: ${currMean}`);
    let diffPa = this._lastMean - currMean;
    if (Math.abs(diffPa) > this._approxFloorPa) {
      //console.log("Significant change detected");
      if (currMean < this._lastMean) {
        this._countUpwards++;
        if (this._countUpwards > 1) {
          this.callback("up");
        }
        //console.log(`going up! ${this._countUpwards}`);
      } else {
        if (this._countUpwards > 1) {
          this.runCount++;
          this.callback("down");
        }
        this._countUpwards = 0;
        //console.log(`going down! ${this._countUpwards}`);
      }
      this._lastMean = currMean;
    } else {
      //console.log("neither up nor down!");
    }
  }

  getAltitude() {
    // https://www.weather.gov/media/epz/wxcalc/pressureAltitude.pdf
    const atm = 101325;
    const pow = 0.190284;
    const coefficient = 145366.45;
    const feetToMeters = 0.3048;
    let val = (1 - Math.pow(this.barometer.pressure / atm, pow)) * coefficient;
    if (units.distance === "metric") {
      val = val * feetToMeters;
      this.labelUnits.text = "altitude meters";
    } else {
      this.labelUnits.text = "altitude feet";
    }
    this.label.text = Math.floor(val).toLocaleString();
  }

  startBarometer = () => {
    this.barometer = new Barometer();
    this.barometer.addEventListener("reading", this.processBarometer);
    this.barometer.start();
  }

  startBatchBarometer = () => {
    this.barometer = new Barometer({ frequency: 1, batch: 30 });
    this.barometer.addEventListener("reading", this.processBarometer);
    this.barometer.start();
  }

  onMount() {
    if (!this.barometer) {
      this.startBarometer();
    }
  }

  onRender() {}

  onUnmount() {
    if (this.barometer) this.barometer.stop();
  }
}