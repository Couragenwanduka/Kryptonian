import * as Yup from 'yup'

const schema = Yup.object().shape({
    name: Yup.string().required('please Provide a name'),
    email: Yup.string().email('invaild email').required('please provide an email address'),
    password: Yup.string().min(6, 'password must be more than 6 characters').required('please provide a password'),
})

const login = Yup.object().shape({
    email: Yup.string().email('invaild email').required('please provide an email address'),
    password: Yup.string().min(6, 'password must be more than 6 characters').required('please provide a password'),
    otp: Yup.string().required('please provide an otp   ')
})

const file= Yup.object().shape({
    title: Yup.string().required('please provide a title').max(100, 'title must be less than 100 characters')
})

export const validateLogin=async(email:string, password:string, otp:string)=>{
    try{
      await login.validate({email, password, otp}, {abortEarly: false})
      return true;
    }catch(error:any){
        return error.errors
    }
}

export const validateUser=async(name:string, email:string, password:string)=>{
    try{
      await schema.validate({name, email, password}, {abortEarly: false})
      return true;
    }catch(error:any){
        return error.errors
    }
}

export const validateFile=async( title:string)=>{
    try{
      await file.validate({ title}, {abortEarly: false})
      return true;
    }catch(error:any){
        return error.errors
    }
}