import {
  Application
} from "./lib/view";

import Incoming from "./lib/incoming";

import {
  ViewEnd
} from "./views/end";
import {
  ViewExercise
} from "./views/exercise";
import {
  ViewSelect
} from "./views/select";

class MultiScreenApp extends Application {
  screens = {
    ViewSelect,
    ViewExercise,
    ViewEnd
  };
}

MultiScreenApp.start("ViewSelect");

let incoming = new Incoming();