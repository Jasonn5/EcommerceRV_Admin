import { Injectable } from '@angular/core';
import { S3 } from 'aws-sdk';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }

  uploadFile(file, folderName) {
    const contentType = file.type;
    const bucket = new S3(
      {
        accessKeyId: environment.ACCES_KEY_ID,
        secretAccessKey: environment.SECRET_ACCESS_KEY,
        region: environment.REGION
      }
    );

    const params = {
      Bucket: environment.BUCKET_NAME,
      Key: folderName + '/' + file.name,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };

    return bucket.upload(params).promise();
  }

  deleteFile(fileName: string, folderName: string) {
    var file_name = fileName.split('/').reverse();

    const bucket = new S3(
      {
        accessKeyId: environment.ACCES_KEY_ID,
        secretAccessKey: environment.SECRET_ACCESS_KEY,
        region: environment.REGION
      }
    );

    const params = {
      Bucket: environment.BUCKET_NAME,
      Key: folderName + '/' + file_name[0]
    };

    bucket.deleteObject(params, function (err, data) {
      if (err) console.log(err)
      else console.log("Successfully deleted");
    });
  }
}
