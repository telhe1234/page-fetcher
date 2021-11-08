const request = require('request');
const fs = require('fs');
const readline = require('readline');


const inputArgs = process.argv.slice(2);
const url = inputArgs[0];
const filePath = inputArgs[1];

const writeToFile = function(filePath, htmlBody) {
  fs.writeFile(filePath, htmlBody, err => {
    if (err) {
      console.error(err.message);
      return;
    }
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      //we have access to the file stats in `stats`
      // console.log(stats.size);

      //file written successfully
      console.log(`Downloaded and saved ${stats.size} bytes to ${filePath}`);

    })
  });
};

request(url, function (error, response, body) {
  // console.error('error:', error); // Print the error if one occurred
  // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // console.log("body:", body);
  if (error) {
    console.error(error.message);
    return;
  }
  // if non-200 status, assume server error
  if (response.statusCode !== 200) {
    const msg = `Status Code ${response.statusCode} when fetching ${inputArgs[0]} content. Response: ${body}`;
    console.error(error.message);
    return;
  }
  fs.access(filePath, fs.constants.F_OK, (err) => {
    console.log(`${filePath} ${err ? 'does not exist' : 'exists'}`);
    if(!err) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question('This file already exist. Would you like to overwrite it? Answer with Y for yes and any other letter for no: ', (answer) => {
        if(answer !== 'Y' && answer !== 'y') {
          process.exit(1);
          // return;
        }
        writeToFile(filePath, body);
        rl.close();
      });
    } else {
      writeToFile(filePath, body);
    }


  });
});