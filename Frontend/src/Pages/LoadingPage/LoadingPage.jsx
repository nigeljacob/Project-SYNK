import { CircularProgress } from '@mui/material'
import React from 'react'

export default function Loading(props) {
  return (
    <>
      {props.background ? (
        <div className='tw-h-screen tw-w-screen tw-bg-[#272727] tw-justify-center tw-items-center tw-flex tw-flex-col'>
        <CircularProgress className='tw-text-[#5bceff]'/>
        <h3 className='tw-m-[10px]'>{props.message}</h3>
        </div>
      ) : (
        <div className='tw-h-screen tw-w-screen  tw-justify-center tw-items-center tw-flex tw-flex-col'>
        <CircularProgress className='tw-text-[#5bceff]'/>
        <h3 className='tw-m-[10px]'>{props.message}</h3>
        </div>
      )}
    </>
  )
}
