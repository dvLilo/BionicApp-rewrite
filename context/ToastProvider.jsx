import React, { createContext, useState } from 'react'

import { Snackbar } from 'react-native-paper'

export const ToastContext = createContext()

export const ToastProvider = ({ children }) => {

  const [options, setOptions] = useState({
    open: false,
    message: "",
    callback: () => { }
  })

  const toast = ({ open = true, message, callback = () => { } }) => setOptions((currentValue) => ({
    ...currentValue,
    open, message, callback
  }))

  const onClose = () => setOptions((currentValue) => ({
    ...currentValue,
    open: false
  }))

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <Snackbar visible={options.open} onDismiss={options.callback} onIconPress={onClose}>
        {options.message}
      </Snackbar>
    </ToastContext.Provider>
  )
}