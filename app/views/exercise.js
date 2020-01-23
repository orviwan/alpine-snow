import {
  me
} from "appbit";
import document from "document";
import exercise from "exercise";
import { vibration } from "haptics";

import * as config from "../config";
import Cycle from "../lib/cycle"
import {
  Application,
  View,
  $at
} from "../lib/view";
import * as utils from "../lib/utils";
import Altitude from "../subviews/altitude";
import Clock from "../subviews/clock";
import GPS from "../subviews/gps";
import HRM from "../subviews/hrm";
import Popup from "../subviews/popup";
import Weather from "../subviews/weather";

const $ = $at("#view-exercise");

export class ViewExercise extends View {
  el = $();

  btnFinish = $("#btnFinish");
  btnToggle = $("#btnToggle");
  lblStatus = $("#lblStatus");

  elBoxStats = $("#boxStats");

  lblSpeed = $("#lblSpeed");
  lblSpeedUnits = $("#lblSpeedUnits");
  lblRuns = $("#lblRuns");
  lblSpeedMax = $("#lblSpeedMax");
  lblSpeedMaxUnits = $("#lblSpeedMaxUnits");
  lblDistance = $("#lblDistance");
  lblDistanceUnits = $("#lblDistanceUnits");
  lblActiveTime = $("#lblActiveTime");
  lblCalories = $("#lblCalories");

  touchLock = $("#touchLock");
  icnLocked = $("#locked");
  icnUnlocked = $("#unlocked");

  buttonsLocked = false;

  handlePopupNo = () => {
    this.remove(this.popup);
  };

  handlePopupYes = () => {
    this.remove(this.popup);
    exercise.stop();
    Application.switchTo("ViewEnd");
  };

  handleToggle = () => {
    if (exercise.state === "started") {
      this.handlePause();
    } else {
      this.handleResume();
    }
  };

  handleToggleLock = () => {
    this.buttonsLocked = !this.buttonsLocked;
    vibration.start("nudge");
    if (this.buttonsLocked) {
      utils.show(this.icnLocked);
      utils.hide(this.icnUnlocked);
    } else {
      utils.hide(this.icnLocked);
      utils.show(this.icnUnlocked);
    }
  }

  handlePause = () => {
    exercise.pause();
    this.lblStatus.text = "paused";
    this.setComboIcon(this.btnToggle, config.icons.play);
    utils.show(this.btnFinish);
    vibration.start("bump");
  };

  handleAutoPause = () => {
    this.handlePause();
    this.lblStatus.text = "auto-paused";
  };

  handleResume = () => {
    exercise.resume();
    this.lblStatus.text = "";
    this.setComboIcon(this.btnToggle, config.icons.pause);
    utils.hide(this.btnFinish);
    vibration.start("bump");
  };

  setComboIcon(combo, icon) {
    combo.getElementById("combo-button-icon").href = icon;
    combo.getElementById("combo-button-icon-press").href = icon;
  }

  handleFinish = () => {
    let popupSettings = {
      title: "End activity?",
      message: `Are you sure you want to finish this ${
        config.exerciseName
      } session?`,
      btnLeftLabel: "Cancel",
      btnLeftCallback: this.handlePopupNo,
      btnRightLabel: "End",
      btnRightCallback: this.handlePopupYes
    };
    this.popup = new Popup("#subviewPopup", popupSettings);
    this.insert(this.popup);

    vibration.start("nudge");
  };

  handleCancel = () => {
    this.gps.callback = undefined;
    Application.switchTo("ViewSelect");
  }

  handleLocationSuccess = () => {
    this.lblStatus.text = "";
    this.gps.callback = undefined;
    if (!me.permissions.granted("access_exercise")) {
      console.error("access_exercise permission is not granted");
      this.lblStatus.text = "permission error";
      return;
    }
    utils.show(this.btnToggle);
    exercise.start(config.exerciseType, config.exerciseOptions);
    this.cycle.next();
  };

  handleRefresh = () => {
    this.render();
  }

  handleButton = (evt) => {
    evt.preventDefault();
    if (this.buttonsLocked) return;
    switch (evt.key) {
      case "back":
        if (exercise.state === "stopped") {
          this.handleCancel();
        } else {
          this.cycle.next();
        }
        break;
      case "up":
        if (exercise.state === "paused") {
          this.handleFinish();
        }
        break;
      case "down":
        if (exercise.state === "started") {
          this.handleToggle();
        }
        break;
    }
  }

  altitudeDirectionChange = (direction) => {
    if (direction === "up" && exercise.state === "started") {
      this.handleAutoPause();
    } else if (direction === "down" && exercise.state === "paused") {
      this.handleResume();
    }
  }

  onMount() {
    utils.hide(this.btnFinish);
    utils.hide(this.btnToggle);
    this.setComboIcon(this.btnToggle, config.icons.pause);
    this.lblStatus.text = "connecting";

    this.altitude = new Altitude("#subviewAltitude", this.altitudeDirectionChange);
    this.insert(this.altitude);

    this.weather = new Weather("#subviewWeather");
    this.insert(this.weather);

    this.clock = new Clock("#subviewClock1", "seconds", this.handleRefresh);
    this.insert(this.clock);

    this.hrm = new HRM("#subviewHRM");
    this.insert(this.hrm);

    this.gps = new GPS("#subviewGps", this.handleLocationSuccess);
    this.insert(this.gps);

    this.cycle = new Cycle(this.elBoxStats);

    this.btnToggle.addEventListener("click", this.handleToggle);
    this.btnFinish.addEventListener("click", this.handleFinish);
    document.addEventListener("keypress", this.handleButton);

    this.touchLock.addEventListener("click", this.handleToggleLock);
  }

  onRender() {
    if (exercise && exercise.stats) {

      const speed = utils.formatSpeed(exercise.stats.speed.current);
      this.lblSpeed.text = speed.value;
      this.lblSpeedUnits.text = `speed ${speed.units}`;

      this.lblRuns.text = this.altitude.runCount.toLocaleString();

      const speedMax = utils.formatSpeed(exercise.stats.speed.max);
      this.lblSpeedMax.text = speedMax.value;
      this.lblSpeedMaxUnits.text = `speed max ${speedMax.units}`;

      const distance = utils.formatDistance(exercise.stats.distance);
      this.lblDistance.text = distance.value;
      this.lblDistanceUnits.text = `distance ${distance.units}`;

      this.lblActiveTime.text = utils.formatActiveTime(exercise.stats.activeTime);

      this.lblCalories.text = utils.formatCalories(exercise.stats.calories);
    }
  }

  onUnmount() {
    this.cycle.removeEvents();

    this.btnToggle.removeEventListener("click", this.handleToggle);
    this.btnFinish.removeEventListener("click", this.handleFinish);
    document.removeEventListener("keypress", this.handleButton);

    this.touchLock.removeEventListener("click", this.handleToggleLock);
  }
}