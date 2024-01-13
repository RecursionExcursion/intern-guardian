// const { app, dialog } = require("electron");
// const fs = require("fs");
// const path = require("path");

// async function storeImageFile() {
//   try {
//     // Open a dialog to ask for the file path
//     const filePaths = await window.electron.openDialog({
//       properties: ['openFile'],
//     });

//     if (filePaths && filePaths.length > 0) {
//       const filePath = filePaths[0];
//       const fileName = path.basename(filePath);

//       // Copy the chosen file to the application's data path
//       fs.copyFile(filePath, path.join(app.getPath('userData'), fileName), (err) => {
//         if (err) throw err;
//         console.log('Image ' + fileName + ' stored.');

//         // At that point, store some information like the file name for later use
//       });
//     }
//   } catch (error) {
//     console.error('Error while opening dialog:', error);
//   }
// }
