/*
 * Project: Milestone 1
 * File Name: main.js
 * Description: Extract PNG images from a zip file and apply filters to them. 
 *
 * Created Date: Nov 7, 2023
 * Author: Kyle Eeles
 *
 */
const path = require("path");
const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");
const pathDithered = path.join(__dirname, "dithered");
const pathSepia = path.join(__dirname, "sepia");

IOhandler
.unzip(zipFilePath, "unzipped")
.then(() => IOhandler.readDir("unzipped")) 
//.then((arrayOfPNG) => IOhandler.grayScaleAll(arrayOfPNG))
//.then((arrayOfPNG) => IOhandler.ditherAll(arrayOfPNG)) //** Remove comments on this line to try the dithering filter
.then((arrayOfPNG) => IOhandler.sepiaAll(arrayOfPNG)) // ** Remove comments on this line to try the Sepia filter (Filter not producing intended result - any idea why?)
.then(() => console.log("All images have been grayscaled"))
.catch((err) => console.log(err))
