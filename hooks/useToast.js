import React, { useContext } from 'react'

import { ToastContext } from '../context/ToastProvider'

const useToast = () => {

  const { toast } = useContext(ToastContext)

  return toast
}

export default useToast