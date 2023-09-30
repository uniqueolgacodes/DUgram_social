// ALL IMPORTS
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CustomButton, EditProfile, Loading, PostCard, TextInput, TopBar } from '../components';
import { ProfileCard } from '../components';
import { FriendsCard } from '../components';
import { suggest, requests, posts } from "../assets/data";
import { NoProfile } from '../assets';
import { Link } from 'react-router-dom';
import { BsFiletypeGif, BsPersonFillAdd } from 'react-icons/bs';
import { BiImages, BiSolidVideo } from 'react-icons/bi';
import Register from './Register';
import { useForm } from 'react-hook-form';

// ALL FUNCTIONS AND CONSTANTS
const Home = () => {
  const { user, edit } = useSelector((state) => state.user);
  const [friendRequest, setFriendRequest] = useState(requests);
  const [suggestedFriends, setSuggestedFriends] = useState(suggest);
  const {register, handleSubmit, formState : {errors}} = useForm();
  const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false); 
  const handlePostSubmit = async(data) => {}
  
  return (
    <>
      <div className='home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
      <TopBar />
      <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
        {/* LEFT #olgacodes */}
        <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
          {/* Display user profile card */}
          <ProfileCard user={user}/>
          {/* Display user's friends */}
          <FriendsCard friends={user?.friends}/>
        </div>
        
        {/* CENTER #olgacodes */}
        <div className='flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg'>
          {/* Form to post */}
          <form
            onSubmit={handleSubmit(handlePostSubmit)}
            className='bg-primary px-4 rounded-lg'
          >
            <div className='w-full flex items-center gap-2 py-4 border-b border-[#66666645]'>
              <img
                src={user?.profileUrl ?? NoProfile}
                alt={user?.firstName}
                className='w-14 h-14 rounded-full object-cover'
              />
              <TextInput
                styles='w-full rounded-full py-5'
                placeholder='Just...express yourself...'
                name='description'
                register={register("description", {
                  required: "Your wise words are needed here"
                })}
                error={errors.description ? errors.description.message : ''}
               />
            </div>
            {errMsg?.message && (
              <span role='alert'
                    className={`text-sm ${
                      errMsg?.status === "failed"
                      ? "text-[#ff3e3e]"
                      : "text-[#53c053]"
                    } mt-0.5`}>

              {errMsg?.message }

              </span>
            )}

            <div className='flex items-center justify-between py-4'>
              {/* for image upload */}
                <label htmlFor='imgUpload'
                       className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                >
                  <input type="file"
                         onChange={(e) => setFile(e.target.files[0])}
                         className='hidden'
                         id ='imgUpload'
                         data-max-size='5120'
                         accept='.jpg, .png, .jpeg'
                  />
                  <BiImages />
                  <span>Image</span>
                </label>
                    {/* for video upload */}
                <label htmlFor='videoUpload'
                       className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                >
                  <input type="file"
                         onChange={(e) => setFile(e.target.files[0])}
                         className='hidden'
                         id ='videoUpload'
                         data-max-size='5120'
                         accept='.mp4 .wav .mkv'
                  />
                  <BiSolidVideo />
                  <span>Video</span>
                </label>
                    {/* for gif upload */}
                <label htmlFor='vgifUpload'
                       className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                >
                  <input type="file"
                         onChange={(e) => setFile(e.target.files[0])}
                         className='hidden'
                         id ='vgifUpload'
                         data-max-size='5120'
                         accept='.gif'
                  />
                  <BsFiletypeGif />
                  <span>GIF</span>
                </label>
                     
                     {/* post button */}
                <div>
                {posting ? (
                  <Loading/>
                ) : (
                  <CustomButton
                    type='submit'
                    title='Post!'
                    containerStyles='bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm'
                   />
                )}
                </div>
            </div>

          </form>
          
          {loading ? (<Loading/>): posts?.length > 0 ? (posts?.map((post) => (
              <PostCard key={post?._id} post={post} 
              
              user={user}
              deletePost = {() => {}}
              likePost = {() => {}}
              />
          ))): (
            <div className='flex w-full h-full items-center justify-center'>
              <p className='text-lg text-ascent-2'>No posts here </p>
            </div>
          )}
        {/* <PostCard/> */}
        </div>
        
        {/* RIGHT #olgacodes */}
        <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto '>
          {/* FRIEND REQUESTS */}
          <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
            {/* Display friend requests */}
            <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
              <span>Stranger who wanna be friends</span>
              <span>{friendRequest?.length}</span>
            </div>
            <div className='w-full flex flex-col gap-4 pt-4 '>
              {/* Map through friend requests */}
              {friendRequest?.map(({ _id, requestFrom: from }) => (
                <div key={_id} className='flex items-center justify-between'>
                  <Link to={"/profile/" + from._id} className="w-full flex gap-4 items-center cursor-pointer">
                    <img
                      src={from?.profileUrl ?? NoProfile}
                      alt={from?.firstName}
                      className='w-10 h-10 object-cover rounded-full'
                    />
                    <div className='flex-1 '>
                      <p className='text-base font-medium text-ascent-1'>
                        {from?.firstName} {from?.lastName}
                      </p>
                      <span className='text-sm text-ascent-2'>
                        {from?.set ?? "No Set"}
                      </span>
                    </div>
                  </Link>
                  <div className=' flex gap-1 '>
                    {/* Accept friend request button */}
                    <CustomButton
                      title="Ok!"
                      containerStyles='bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full'
                    />
                    {/* Reject friend request button */}
                    <CustomButton
                      title="Nah"
                      containerStyles='border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full'
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* SUGGESTED FRIENDS */}
          <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
            {/* Display suggested friends */}
            <div className='flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]'>
              <span>We Suggest</span>
            </div>
            <div className='w-full flex flex-col gap-4 pt-4 '>
              {/* Map through suggested friends */}
              {suggestedFriends?.map((friend) => (
                <div key={friend._id} className='flex items-center justify-between'>
                  <Link to={"/profile/" + friend?._id} key={friend?._id} className="w-full flex gap-4 items-center cursor-pointer">
                    <img
                      src={friend?.profileUrl ?? NoProfile}
                      alt={friend?.firstName}
                      className='w-10 h-10 object-cover rounded-full'
                    />
                    <div className='flex-1'>
                      <p className='text-base font-medium text-ascent-1'>
                        {friend?.firstName} {friend?.lastName}
                      </p>
                      <span className='text-sm text-ascent-2'>
                        {friend?.set ?? "No Set"}
                      </span>
                    </div>
                  </Link>
                  <div className='flex gap-1 '>
                    {/* Add friend button */}
                    <button className='bg-[#0444a430] text-sm text-white p-1 rounded' onClick={() => {}}>
                      <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    { edit && <EditProfile/> }   
    </>
  );
}

export default Home;