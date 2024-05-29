import fs from 'fs';
import path from 'path';

const deleteuploadedFiles=(file:any)=>{
    const filePath = path.join(__dirname, '../../uploads', file.filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Failed to delete the file:', err);
      }
    });
}

export default deleteuploadedFiles;