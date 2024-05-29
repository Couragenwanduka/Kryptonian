import { Request, Response } from 'express';
import { validateFile } from '../config/yup';
import userService from '../service/user.service';
import deleteUploadedFiles from '../helper/deleteupload'; 
import fs from 'fs';

class FileController {
    async uploadFile(req: Request, res: Response) {
        try {
            const {title} = req.body;
            
            const {apikey}= req.query

            const valid:any = await validateFile(title);
           
            if (valid !== true) return res.status(403).json({ message: valid });

            const user = await userService.findUserByApiKey(apikey);

            if (!user) return res.status(404).json({ message: 'User not found' });


            const file:any = req.file;

            if (!file) return res.status(400).json({ message: 'No file uploaded' });

            // Read file content as binary data
            const data = fs.readFileSync(file.path);

           
            // Convert binary data to Base64
            const base64Data = data.toString('base64');

            const fileData = {
                title,
                data: base64Data, 
                mimeType: file.mimetype,
                size: file.size
            };
           
            const savedFile = await userService.saveFile(user._id, fileData);

            // Delete the uploaded file
            deleteUploadedFiles(file);

            res.status(200).json({ message: 'File uploaded successfully', savedFile: savedFile });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error });
        }
    }
}

export default new FileController();
