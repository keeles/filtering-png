/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: Nov 7, 2023
 * Author: Kyle Eeles
 *
 */

const AdmZip = require("adm-zip"),
  fs = require("fs").promises,
  {createReadStream, createWriteStream} = require("fs"),
  PNG = require("pngjs").PNG, 
  path = require("path"), 
  { pipeline } = require("stream"), 
  pathProcessed = path.join(__dirname, "grayscaled"),
  pathDithered = path.join(__dirname, "dithered"),
  pathSepia = path.join(__dirname, "sepia");
/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    try {
      const zip = new AdmZip(pathIn);
      zip.extractAllTo(pathOut, true);
      resolve(console.log("Extraction operation complete"));
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */

const isDataPNG = (directory) => {
  const arrayOfPNG = [];
  for (const file of directory) {
    let fileType = path.extname(`/${directory}/${file}`);
    if (fileType === ".png") {
      arrayOfPNG.push(path.join(__dirname, `unzipped/${file}`));
    }
  }
  return arrayOfPNG;
};

const readDir = (dir) => {
  return fs.readdir(dir).then((files) => (arrayOfPNG = isDataPNG(files)));
};

/**
 * grayScale Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */

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
};

const grayScaleAll = (array) => {
  let workerPromises = []
  for (let i = 0; i < array.length; i++) {
      workerPromises.push(() => grayScale(array[i], path.join(pathProcessed, `out${i + 1}.png`)))       
  }
  Promise.all(workerPromises.map((func) => func()))
}

/**
 * ditherImages Description: Read in png file by given pathIn,
 * convert to dithered and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */

const ditherImages = (pixels, height, width) => {
  let lastPixel = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let idx = (width * y + x) << 2;

      let r = pixels[idx];
      let g = pixels[idx + 1];
      let b = pixels[idx + 2];
      let pixelValue = (r + g + b) / 3;

      if (pixelValue >= 128 && lastPixel === 0) {
        r = 255;
        g = 255;
        b = 255;
        lastPixel = 255;
      } else {
        r = 0;
        g = 0;
        b = 0;
        lastPixel = 0;
      }

      pixels[idx] = (r + g + b) / 3; // R
      pixels[idx + 1] = (r + g + b) / 3; // G
      pixels[idx + 2] = (r + g + b) / 3; // B
    }
  }
  return pixels;
};

const dithering = (pathIn, pathOut) => {
  pipeline(
    createReadStream(pathIn),
    new PNG({filterType: 4}).on("parsed", function () {
      this.data = ditherImages(this.data, this.width, this.height);
      this.pack();
    }),
    createWriteStream(pathOut),
    function (err) {
      console.log(err);
    }
  );
};

const ditherAll = (array) => {
  let workerPromises = []
  for (let i = 0; i < array.length; i++) {
      workerPromises.push(() => dithering(array[i], path.join(pathDithered, `out${i + 1}.png`)))       
  }
  Promise.all(workerPromises.map((func) => func()))
}

/**
 * sepiaImages Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 * 
 * This Filter is not quite working, turning images blue rather then Sepia *
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */

const sepiaImages = (pixels, width, height) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let idx = (width * y + x) << 2;

      let r = pixels[idx];
      let g = pixels[idx + 1];
      let b = pixels[idx + 2];

      newRed = r * 0.393 + g * 0.769 + b * 0.189; // R
      newGreen = r * 0.349 + g * 0.686 + b * 0.168; // G
      newBlue = r * 0.272 + g * 0.534 + b * 0.131; // B

      if (newRed > 255) {
        newRed = 255;
      }
      if (newGreen > 255) {
        newGreen = 255;
      }
      if (newBlue > 255) {
        newBlue = 255;
      }

      pixels[idx] = newRed
      pixels[idx + 1] = newGreen
      pixels[idx + 2] = newBlue
    }
  }
  return pixels;
};

const sepiaFilter = (pathIn, pathOut) => {
  pipeline(
    createReadStream(pathIn),
    new PNG({filterType: 4}).on("parsed", function () {
      this.data = sepiaImages(this.data, this.width, this.height);
      this.pack();
    }),
    createWriteStream(pathOut),
    function (err) {
      console.log(err);
    }
  );
};

const sepiaAll = (array) => {
  let workerPromises = []
  for (let i = 0; i < array.length; i++) {
      workerPromises.push(() => sepiaFilter(array[i], path.join(pathSepia, `out${i + 1}.png`)))       
  }
  Promise.all(workerPromises.map((func) => func()))
}

module.exports = {
  unzip,
  readDir,
  dithering,
  sepiaFilter,
  grayScale,
  grayScaleAll ,
  ditherAll, 
  sepiaAll
};
