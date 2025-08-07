import fs from 'fs';
import csv from 'csv-parser';

import { DATA_PATH } from '@/constant/path';

function processCsvData(data: any[]) {
  // const newDataObj: any = {};

  // initial construction of the data object
  for (let i = 0; i < data.length; i++) {
    delete data[i][''];
    delete data[i]['School'];
    delete data[i]['StartDate'];
    delete data[i]['EndDate'];

    // const keys = Object.keys(data[i]);
    // for (let j = 0; j < keys.length; j++) {
    //   if (newDataObj[keys[j]] === undefined) {
    //     newDataObj[keys[j]] = {};
    //   }
    //   if (data[i][keys[j]].trim() !== '') {
    //     if (newDataObj[keys[j]][data[i][keys[j]].trim()] === undefined) {
    //       newDataObj[keys[j]][data[i][keys[j]].trim()] = 0;
    //     } else {
    //       newDataObj[keys[j]][data[i][keys[j]].trim()]++;
    //     }
    //   }
    // }
  }

  // process the numerical data
  // for (let i in newDataObj) {
  //   const curData = newDataObj[i];
  //   const keys = Object.keys(curData);
  //   if (!isNaN(Number(keys[0]))) {
  //     // it's numerical data
  //     let min = Infinity;
  //     let max = -Infinity;
  //     for (let j = 0; j < keys.length; j++) {
  //       const thisKey = Number(keys[j]);
  //       if (thisKey > max && curData[keys[j]] > 0) {
  //         max = thisKey;
  //       }
  //       if (thisKey < min && curData[keys[j]] > 0) {
  //         min = thisKey;
  //       }
  //     }
  //     const gap = Math.ceil((max - min) / 8);
  //     const newSurveyObj: any = {};
  //     for (let j = min; j <= max; j += gap) {
  //       const newKeyName = j + '-' + (j + gap);
  //       newSurveyObj[newKeyName] = 0;
  //       for (let k in curData) {
  //         const thisKey = Number(k);
  //         if (thisKey >= j && thisKey < j + gap) {
  //           newSurveyObj[newKeyName] += curData[k];
  //         }
  //       }
  //       if (j === max) break;
  //     }
  //     newDataObj[i] = newSurveyObj;
  //   }
  // }

  // return newDataObj;
}

export default function loadData() {
  return new Promise(res => {
    const fileCount = DATA_PATH.length;
    const loadedFileData: any = {};
    for (let i = 0; i < DATA_PATH.length; i++) {
      const results: any[] = [];
      fs.createReadStream(DATA_PATH[i].path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          processCsvData(results);
          loadedFileData[DATA_PATH[i].key] = results;
          if (Object.keys(loadedFileData).length >= fileCount) {
            // loaded all files
            res(loadedFileData);
          }
        })
    }
  })
}