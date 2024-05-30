import User from "../model/user";
import {hashPassword} from '../config/bcrypt'

class userService {
    constructor() {
        
    }

    async createUser(name:string,email: string, password: string) {
      try{
        const passwordHash = await hashPassword(password);
       const  newUser= new User({
        name,
        email,
        password: passwordHash,
       })
       const user = await  newUser.save();
       return user;
      }catch(error){
        console.log(error);
      }
    }
    async findUserByEmail(email: string) {
        try{
            const user = await User.findOne({email});
            return user;
        }catch(error){
            console.log(error);
        }
    }
    async verifyEmail(email: string) {
        try{
           const user = await User.findOneAndUpdate({email}, {$set:{isConfirmed:true}},{new:true});
           return user;
        }catch(error){
            console.log(error);
        }
    }
    async addApiKey(apiKey: string, email: string) {
        try{
          const user = await User.findOneAndUpdate({email}, {$set:{apiKey:apiKey}},{new:true});
          return user;
        }catch(error){
            console.log(error);
        }
    }

    async findUserByApiKey(apiKey: any) {
      try{
        const user = await User.findOne({apiKey: apiKey});
        return user;
      }catch(error){
        console.log(error);
      }
    }

    async deactivateApikey(apiKey: any) {
      try{
        const user = await User.findOneAndUpdate({apiKey: apiKey}, {$set:{apiKey:null}},{new:true});
        return user;
      }catch(error){
        console.log(error);
      }
    }

    async saveFile(userId: any, file: any){
         try{
          const user = await User.findById(userId);
          if (!user) {
            throw new Error('User not found');
          }
         user.files.push(file);
          await user.save();
          return user;
         }catch(error){
            console.log(error)
         }
    }

    async getallfiles(){
      try{
        const user = await User.find();
        const files= user.flatMap(user=>user.files)
        return files;
      }catch(error){
        console.log(error)
      }
    }
}

const userservice=  new userService();

export default userservice;