/*
 * Project: Milestone 1
 * File Name: workerMain.js
 * Description: Same as Main.js but using worker threads to apply the filter to the images. 
 *
 * Created Date: Nov 7, 2023
 * Author: Kyle Eeles
 *
 */
const path = require("path");
const IOhandler = require("./IOhandler");
const workerIO = require("./workerIO")
const zipFilePath = path.join(__dirname, "myfile.zip");

IOhandler
.unzip(zipFilePath, "unzipped")
.then(() => IOhandler.readDir("unzipped"))
.then((arrayOfPNG) => workerIO.grayScaleArray(arrayOfPNG))
.then(() => console.log("All images have been grayscaled."))
.catch((err) => console.log(err))
