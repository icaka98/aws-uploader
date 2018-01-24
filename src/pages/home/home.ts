import { Component } from '@angular/core';
//import * as AWS from 'aws-sdk/dist/aws-sdk';
require('aws-sdk');

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  AWSService :any;
  bucket :any;
  S3 :any;
  file :any;
  files :any;

  constructor() {
    this.config();
    this.listFiles();
  }

  /**
   * @desc Configuration for AWS.
   */
  config(){
    this.AWSService = (<any>window).AWS;
    this.AWSService.config.region = "eu-central-1";

    this.AWSService.config.accessKeyId = ''; // Add the accessKey here
    this.AWSService.config.secretAccessKey = ''; // Add the secretAccessKey here

    this.bucket = new this.AWSService.S3({params: {Bucket: 'test-upload-list-delete-files'}});

    this.S3 = new this.AWSService.S3({apiVersion: '2006-03-01'});
  }

  /**
   * @desc Get the inputted file.
   * @param fileInput
   */
  fileEvent(fileInput: any){
      this.file = fileInput.target.files[0];
  }

  /**
   * @desc Upload the inputted file to S3 bucket.
   */
  uploadCurrentFile(){
    let params = {Key: this.file.name, Body: this.file};

    this.bucket.upload(params, function (error, res) {
      console.log('error', error);
      console.log('response', res);
    });

    let obj = this;
    setTimeout(function () {
      obj.listFiles();
    }, 1000);
  }

  /**
   * @desc List all the bucket files in AWS S3.
   */
  listFiles(){
      let readParams = {
          Bucket : 'test-upload-list-delete-files',
      };

      let obj = this;
      this.S3.listObjects(readParams, function(err, data) {
          if (err) console.log("Error", err);
          else {
            console.log("Success", data);

            obj.files = data.Contents;
          }
      });
  }

  /**
   * @desc Delete given file from bucket in S3.
   * @param fileName
   */
  deleteFile(fileName :any){
      let params = {
          Bucket: 'test-upload-list-delete-files',
          Key: fileName
      };

      this.S3.deleteObject(params, function(err, data) {
          if(err) console.log(err);
          else console.log("Successfully deleted " + fileName);
      });

      let obj = this;
      setTimeout(function () {
          obj.listFiles();
        }, 1000);
  }
}
