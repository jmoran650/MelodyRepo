// s3Controller.ts

import AWS from "aws-sdk";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Set in your environment variables
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const generateUploadURL = async (req: Request, res: Response) => {
  const { fileType } = req.body;

  const fileExtension = fileType.split("/")[1];
  const fileName = `${uuidv4()}.${fileExtension}`; // Generate a unique file name

  const params = {
    Bucket: "melodyimagebucket",
    Key: fileName,
    Expires: 60, // URL expires in 60 seconds
    ContentType: fileType,
    ACL: "public-read",
  };

  try {
    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    res.status(200).json({ uploadURL, key: fileName });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    res.status(500).json({ message: "Error generating upload URL" });
  }
};
