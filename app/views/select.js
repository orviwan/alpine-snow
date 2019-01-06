import { me } from "appbit";
import document from "document";

import * as config from "../config";
import { Application, View, $at } from "../lib/view";

const $ = $at("#view-select");

export class ViewSelect extends View {
  el = $();

  constructor() {
    this.btnStart = $("#btnStart");
    this.lblStart = $("#lblStart");

    super();
  }

  handleStart = () => {
    Application.switchTo("ViewExercise");
  }

  handleKeypress = (evt) => {
    if (evt.key === "down") this.handleStart();
  }

  onMount() {
    me.appTimeoutEnabled = false; // Disable timeout

    this.btnStart.addEventListener("click", this.handleStart);
    document.addEventListener("keypress", this.handleKeypress);

    this.lblStart.text = config.exerciseName;
  }

  onRender() { }

  onUnmount() {
    this.btnStart.removeEventListener("click", this.handleStart);
    document.removeEventListener("keypress", this.handleKeypress);
  }
}
