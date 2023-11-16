const { Worker } = require("worker_threads"),
  path = require("path");

  /**
 * grayScale Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut using 
 * worker threads
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */

const grayScale = (pathIn, pathOut) => {
  return new Promise ((resolve, reject) => {
  const imageInName = pathIn.split(__dirname)[1]
  const imageOutName = pathOut.split(__dirname)[1]
    const worker = new Worker("./workerThread.js", {
        workerData: { pathIn:pathIn, pathOut:pathOut }
    })
    worker.on("exit", () => {
        resolve()
    })
    worker.on("error", (err) => {
        reject(err)
    })
  })
};

const grayScaleArray = async (array) => {
  let workerPromises = []
  for (let i = 0; i < array.length; i++) {
      workerPromises.push(() => grayScale(array[i], path.join(__dirname, "grayscaled", `out${i + 1}.png`)))       
  }
  await Promise.all(workerPromises.map((func) => func()))
}

module.exports = {
  grayScale,
  grayScaleArray
};
