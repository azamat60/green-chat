import { useEffect, useReducer } from 'react'
import { loadChats, saveChats } from '../lib/storage'
import { chatsReducer } from '../state/chatsReducer'

export function useChats(idInstance: string) {
  const [chats, dispatch] = useReducer(chatsReducer, idInstance, loadChats)

  useEffect(() => {
    saveChats(idInstance, chats)
  }, [idInstance, chats])

  return [chats, dispatch] as const
}
