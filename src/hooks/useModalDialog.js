import { useRef, useState } from 'react'

export default function useModalDialog() {
  const dialogRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)

  function open() {
    dialogRef.current.showModal()
    setIsOpen(true)
  }

  function close() {
    dialogRef.current.close()
  }

  function handleClose() {
    setIsOpen(false)
  }

  return { dialogRef, isOpen, open, close, handleClose }
}
