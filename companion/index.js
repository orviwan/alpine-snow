import {
  encode
} from "cbor";
import companion from "companion";
import {
  outbox
} from "file-transfer";
import {
  geolocation
} from "geolocation";

const MILLISECONDS_PER_HOUR = 1000 * 60 * 60;
companion.wakeInterval = 1 * MILLISECONDS_PER_HOUR;
companion.addEventListener("wakeinterval", refreshWeather);

companion.monitorSignificantLocationChanges = true;
companion.addEventListener("significantlocationchange", refreshWeather);

refreshWeather();

function refreshWeather() {
  geolocation.getCurrentPosition(pos => {
    fetchWeather(pos.coords.latitude.toFixed(3), pos.coords.longitude.toFixed(3));
  });
}

function fetchWeather(lat, long) {
  // TODO
  return;
  fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
      return response.json();
    })
    .then(json => {
      returnWeatherData(json.data);
    })
    .catch(error => {
      console.error(`Fetch failed: ${error}`);
    })
}

function returnWeatherData(data) {
  const destFilename = "weather.cbor";
  outbox.enqueue(destFilename, encode(data)).then(ft => {
    console.log(`Transfer of '${destFilename}' successfully queued.`);
  }).catch(function (error) {
    throw new Error(`Failed to enqueue '${destFilename}'. Error: ${error}`);
  });
}