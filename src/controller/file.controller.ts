import { Request, Response } from 'express';
import { validateFile } from '../config/yup';
import userService from '../service/user.service';
import deleteUploadedFiles from '../helper/deleteupload'; 
import fs from 'fs';

class FileController {
    async uploadFile(req: Request, res: Response) {
        try {
            const {title} = req.body;
            
            const {apiKey}= req.query

            

            const valid:any = await validateFile(title);
           
            if (valid !== true) return res.status(403).json({ message: valid });

            const user = await userService.findUserByApiKey(apiKey);

            if (!user) return res.status(404).json({ message: 'invalid apiKey' });


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

    async getFiles(req: Request, res: Response) {
        try {

            const files= await userService.getallfiles()

            if(files === undefined) return res.status(404).json({ message:"no files found"});

            const data= files.map(file => {
                return {
                    title: file.title,
                    data: file.data,
                    mimeType: file.mimeType,
                    size: file.size
                }       
        }

        )
        
        res.status(200).json({ message: 'Files retrieved successfully', files: data });

        }catch(error){
            console.log(error);
            res.status(500).json({ message: error}) 
        }
    }

    async deactivateApiKey(req:Request, res:Response){
        try{
         const { apiKey} = req.query;
         
         console.log(apiKey);

         const user = await userService.findUserByApiKey(apiKey);

         console.log(user);

         if (!user) return res.status(404).json({ message: 'User not found' });

         const deactivate = await userService.deactivateApikey( apiKey)

         if (!deactivate) return res.status(404).json ({ message: ' unable to deactivate apikey' });

         res.status(200).json({ message:'Successfully deactivated'});

        }catch(error){
            console.log(error);
            res.status(500).json({ message: error}) 
        }
        
    }
}

export default new FileController();
