// s3Controller.ts

import AWS from 'aws-sdk';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

require('dotenv').config(); // Ensure dotenv is loaded

// Initialize the AWS S3 client
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,      // Ensure these are loaded
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
  signatureVersion: 'v4',                          // Set signatureVersion here
});

export const generateUploadURL = async (req: Request, res: Response) => {
  const { fileType } = req.body;
  console.log('Received fileType:', fileType);

  const fileExtension = fileType.split('/')[1];
  const fileName = `${uuidv4()}.${fileExtension}`; // Generate a unique file name
  console.log('Generated fileName:', fileName);

  // Correct params without signatureVersion
  const params = {
    Bucket: 'melodyimagebucket',
    Key: fileName,
    Expires: 60, // URL expires in 60 seconds
    ContentType: fileType,
    //ACL: 'public-read',
  };

  console.log('S3 Params:', params);

  try {
    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    console.log('Generated uploadURL:', uploadURL);
    res.status(200).json({ uploadURL, key: fileName });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    res.status(500).json({ message: 'Error generating upload URL' });
  }
};