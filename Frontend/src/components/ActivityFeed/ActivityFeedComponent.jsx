import React from 'react'

const ActivityFeedComponent = () => {
  return (
    <div className='tw-mt-[10px]'>
        <div className='tw-flex tw-items-center'>
            <div className='tw-w-[35px] tw-h-[35px] tw-rounded-[50%]'>
                <img src="https://www.w3schools.com/howto/img_avatar.png" alt=""  className='tw-rounded-[50%] tw-object-cover'/>
            </div>

            <h3 className='tw-text-[11px] tw-ml-[20px]'>12:23</h3>

            <h3 className='tw-text-[14px] tw-ml-[20px]'><span className='tw-font-bold'>Nigel Jacob</span> has requested to join <span className='tw-font-bold'>SDGP Group</span></h3>
        </div>

        <div>
            <div className=''>

            </div>
        </div>
    </div>
  )
}

export default ActivityFeedComponent
