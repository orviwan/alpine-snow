import * as fs from "fs";
import {
  units
} from "user-settings";

import {
  convertTemperature,
  zeroPad
} from "../lib/utils";
import {
  View,
  $at
} from "../lib/view";

export default class Weather extends View {
  constructor(parent) {
    const $ = $at(parent);
    this.labelTemperature = $("#lblTemperature");
    this.labelUnits = $("#lblWeatherUnits");
    this.iconConditions = $("#icnCondition");
    this.renderLimit = 120;
    this._renderCount = 0;
  }

  refreshWeather = () => {
    let data;

    try {
      data = fs.readFileSync("/private/data/weather.cbor", "cbor");
    } catch (e) {}

    if (data && data.weather && data.weather.length > 0) {
      this.labelTemperature.text = convertTemperature(data.main.temp);
      this.iconConditions.href = `images/weather/weather_${zeroPad(data.weather[0].icon)}.png`;
    } else {
      this.labelTemperature.text = "--°";
      this.iconConditions.href = "";
    }
  }

  setUnitsText() {
    if (units.distance === "metric") {
      this.labelUnits.text = "celsius";
    } else {
      this.labelUnits.text = "fahrenheit";
    }
  }

  // conditionText(condition) {
  //   switch (condition) {
  //     case 1:
  //       return "Sunny";
  //     case 2:
  //       return "Mostly Sunny";
  //     case 3:
  //       return "Partly Sunny";
  //     case 4:
  //       return "Intermittent Clouds";
  //     case 5:
  //       return "Hazy Sunshine";
  //     case 6:
  //       return "Mostly Cloudy";
  //     case 7:
  //       return "Cloudy";
  //     case 8:
  //       return "Dreary (Overcast)";
  //     case 11:
  //       return "Fog";
  //     case 12:
  //       return "Showers";
  //     case 13:
  //       return "Mostly Cloudy w/ Showers";
  //     case 14:
  //       return "Partly Sunny w/ Showers";
  //     case 15:
  //       return "Thunderstorms";
  //     case 16:
  //       return "Mostly Cloudy w/ Thunderstorms";
  //     case 17:
  //       return "Partly Sunny w/ Thunderstorms";
  //     case 18:
  //       return "Rain";
  //     case 19:
  //       return "Flurries";
  //     case 20:
  //       return "Mostly Cloudy w/ Flurries";
  //     case 21:
  //       return "Partly Sunny w/ Flurries";
  //     case 22:
  //       return "Snow";
  //     case 23:
  //       return "Mostly Cloudy w/ Snow";
  //     case 24:
  //       return "Ice";
  //     case 25:
  //       return "Sleet";
  //     case 26:
  //       return "Freezing Rain";
  //     case 29:
  //       return "Rain and Snow";
  //     case 30:
  //       return "Hot";
  //     case 31:
  //       return "Cold";
  //     case 32:
  //       return "Windy";
  //     case 33:
  //       return "Clear";
  //     case 34:
  //       return "Mostly Clear";
  //     case 35:
  //       return "Partly Cloudy";
  //     case 36:
  //       return "Intermittent Clouds";
  //     case 37:
  //       return "Hazy Moonlight";
  //     case 38:
  //       return "Mostly Cloudy";
  //     case 39:
  //       return "Partly Cloudy w/ Showers";
  //     case 40:
  //       return "Mostly Cloudy w/ Showers";
  //     case 41:
  //       return "Partly Cloudy w/ Thunderstorms";
  //     case 42:
  //       return "Mostly Cloudy w/ Thunderstorms";
  //     case 43:
  //       return "Mostly Cloudy w/ Flurries";
  //     case 44:
  //       return "Mostly Cloudy w/ Snow";
  //     default:
  //       return "Unknown";
  //   }
  // }

  onMount() {
    this.setUnitsText();
  }

  onRender() {
    if (!this._renderCount % this.renderLimit) {
      this.refreshWeather();
    }
    this._renderCount++;
    if (this._renderCount > this.renderLimit) this._renderCount = 0;
  }

  onUnmount() {}
}