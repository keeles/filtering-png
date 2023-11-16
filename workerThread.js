const { workerData } = require("worker_threads"),
 { pipeline } = require("stream"),
 { createReadStream, createWriteStream } = require("fs"),
 { pathIn, pathOut } = workerData,
 PNG = require("pngjs").PNG;

const grayImages = (pixels, height, width) => {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let idx = (width * y + x) << 2;
  
        let r = pixels[idx];
        let g = pixels[idx + 1];
        let b = pixels[idx + 2];
  
        pixels[idx] = (r + g + b) / 3; // R
        pixels[idx + 1] = (r + g + b) / 3; // G
        pixels[idx + 2] = (r + g + b) / 3; // B
      }
    }
    return pixels;
  };

const grayScale = (pathIn, pathOut) => {
pipeline(
    createReadStream(pathIn),
    new PNG({filerType: 4}).on("parsed", function () {
      this.data = grayImages(this.data, this.width, this.height);
      this.pack();
    }),
    createWriteStream(pathOut),
    function (err) {
      console.log(err);
    }
  );
}

grayScale(pathIn, pathOut)