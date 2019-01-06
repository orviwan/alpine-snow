import {
  inbox
} from "file-transfer";

export default class Incoming {
  constructor() {
    this.setup();
  }

  setup = () => {
    inbox.addEventListener("newfile", this.processAllFiles);
    this.processAllFiles();
  }

  processAllFiles = () => {
    let fileName;
    while (fileName = inbox.nextFile()) {
      // console.log(`/private/data\/${fileName} is now available`);
    }
  }
}