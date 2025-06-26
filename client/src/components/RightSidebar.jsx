import assets, { imagesDummyData } from '../assets/assets'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { useEffect, useState } from 'react'

const RightSidebar = () => {

  const {selectedUser, messages} = useContext(ChatContext);
  const {logout, onlineUsers} = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    setMsgImages(
      messages.filter(msg => msg.image).map(msg => msg.image)
    )
  }, [messages])

  return selectedUser && (
    <div className={`bg-[#8185B2]/10 text-white w-full h-full overflow-y-auto relative ${selectedUser ? 'max-md:hidden' : ''}`}>

      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 h-20 rounded-full object-cover'/>
        <h1 className='px-10 text-xl font-medium flex items-center gap-2'>
          {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span> }
          {selectedUser.fullName}
        </h1>
        <p className='px-10 text-center text-gray-300'>{selectedUser.bio}</p>
      </div>

      <hr className='border-[#ffffff50] my-4'/>

      <div className='px-5 text-xs pb-20'>
        <p className='text-gray-200 mb-2'>Media</p>
        <div className='max-h-[200px] overflow-y-auto grid grid-cols-2 gap-2'>
          {msgImages.map((url, index) => (
            <div key={index} onClick={() => window.open(url)} className='cursor-pointer rounded-md overflow-hidden hover:opacity-80 transition-opacity'>
              <img src={url} alt="" className='w-full h-20 object-cover rounded-md'/>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => logout()} className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-6 rounded-full cursor-pointer hover:from-purple-500 hover:to-violet-700 transition-all duration-200'>
        Logout
      </button>
 
    </div>
  )
}

export default RightSidebar