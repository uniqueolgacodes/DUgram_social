import React, { useState } from 'react'
import { useForm } from "react-hook-form";
// const { useDispatch } = React.useContext(React.createContext);
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import {TbSocial} from "react-icons/tb";
import {BsShare} from "react-icons/bs";
import {TextInput} from '../components';
import {Loading} from '../components';
import { CustomButton } from '../components';
import { BgImage } from '../assets';
import {AiOutlineInteraction} from "react-icons/ai";
import {ImConnection} from "react-icons/im";
// import { rootReducer } from '../redux/reducer';
// import { userReducer } from "./redux/userSlice";


const Login = () => {
  const {
    register, handleSubmit, formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async(data)=> {

  }

  const[errMsg, setErrMsg] = useState("");
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);


  return (
    <div className='bg-bgColor w-full h-[100vh] flex items-center justify-center p-6'>
        <div className='w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-xl'>
          {/*LEFT */}
          <div className='w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center'>

            <div className='w-full flex gap-2 items-center mb-6'>
                <div className='p-2 bg-[#065ad8] rounded text-white'>
                  <TbSocial /> {/* This is for the logo of DUgram*/}
                </div>
                <span className='text-2xl text-[#065ad8] font-semibold'>DUgram</span> {/* This is for the name on the login page*/}
            </div> {/* This is for the logo part of DUgram*/}


            <p className='text-ascent-1 text-base font-semibold'>
              Login to your account
            </p>
            <span className='text-sm mt-2 text-ascent-2'>Welcome back!</span>
        
            <form className="py-8 flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>

              {/* This is for the emails #olgacodes */}
              <TextInput 
                name="email" placeholder="email@example.com" 
                styles="w-full rounded-full" label="Email  Address" 
                type="email"
                register={
                  register("email", {
                    required: "Yo, we need that email",
                  })
                }
                labelStyles="ml-2"
                error={errors.email ? errors.email.message: ""}
              />

              {/* This is for our passwords #olgacodes */}

              <TextInput 
                name="password" placeholder="Password" 
                styles="w-full rounded-full" label="Password" 
                type="password"
                register={
                  register("password", {
                    required: "Where's you going? Password, please!",
                  })
                }
                labelStyles="ml-2"
                error={errors.password ? errors.password.message: ""}
              />

              {/* This is for our forgot passwords #olgacodes */}
              <Link
              to="/reset-password"
              className="text-sm text-right text-blue font-semibold"
              >
                Click me! 'Cause you forgot your password
              </Link>

                {
                  errMsg?.message && (
                    <span className={`text-sm ${
                      errMsg?.status === "failed" ? "text-[#f64949fe]" : "text-[#2ba150fe]"
                    } mt-0.5`}>
                      {errMsg?.message}
                    </span>
                  )}

                {
                  isSubmitting ? <Loading /> : <CustomButton 
                    type="submit"
                    containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 py-3 text-sm font-medium text-white outline-none`}
                    title="Let's Go!"
                  />
                }

            </form>

            <p className='py-2 flex flex-row items-center'>
                Don't have an account?
                <Link 
                  to="/register"
                  className='text-[#065ad8] font-semibold ml-2 curor-pointer'
                >
                  Wanna get one?
                </Link>
                
            </p>
             
          </div>

          {/* RIGHT*/}

          <div className='hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue'>

                <div className="relative w-full flex items-center justify-center">
                    <img
                      src={BgImage}
                      alt='Bg Image'
                      className='w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover'
                    />

                    <div className="absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full">
                      <BsShare size={14} />
                      <span className='text-xs font-medium'>Share</span>
                    </div>

                    <div className="absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full">
                      <ImConnection />
                      <span className='text-xs font-medium'>Connect</span>
                    </div>

                    <div className="absolute flex items-center gap-1 bg-white left-12 bottom-6 py-2 px-5 rounded-full">
                      <AiOutlineInteraction />
                      <span className='text-xs font-medium'>Interact</span>
                    </div>
                </div>

                <div className='mt-16 text-center'>
                    <p className='text-white text-base'>
                      Connect with friends, share & have fun!
                    </p>
                    <span className='text-sm text-white/80'>
                      Connect, Share, and Shine: Your Social World Awaits!
                    </span>
                </div>

          </div>
        </div>
    </div>
  )
}

export default Login