import { describe, expect, it } from 'vitest'
import type { Chat, Message } from '../types'
import { chatsReducer } from './chatsReducer'

const message = (overrides: Partial<Message> = {}): Message => ({
  id: 'm1',
  text: 'hello',
  timestamp: 1_700_000_000,
  outgoing: false,
  ...overrides,
})

const chat = (overrides: Partial<Chat> = {}): Chat => ({
  id: '100',
  messages: [],
  unread: 0,
  ...overrides,
})

describe('chatsReducer', () => {
  it('opens a new chat at the top of the list', () => {
    const state = chatsReducer([chat({ id: '1' })], {
      type: 'openChat',
      chat: { id: '2', phone: '79001234567' },
    })

    expect(state.map((c) => c.id)).toEqual(['2', '1'])
    expect(state[0]).toMatchObject({ phone: '79001234567', messages: [], unread: 0 })
  })

  it('does not duplicate an existing chat', () => {
    const initial = [chat()]
    expect(chatsReducer(initial, { type: 'openChat', chat: { id: '100' } })).toBe(initial)
  })

  it('creates a chat for an incoming message from an unknown sender', () => {
    const state = chatsReducer([], {
      type: 'addMessage',
      chatId: '200',
      message: message(),
      title: 'Ivan',
      unread: true,
    })

    expect(state).toEqual([{ id: '200', title: 'Ivan', messages: [message()], unread: 1 }])
  })

  it('moves the chat with a new message to the top', () => {
    const state = chatsReducer([chat({ id: '1' }), chat({ id: '2' })], {
      type: 'addMessage',
      chatId: '2',
      message: message(),
    })

    expect(state.map((c) => c.id)).toEqual(['2', '1'])
  })

  it('ignores a message that is already in the chat', () => {
    const initial = [chat({ messages: [message()] })]
    expect(chatsReducer(initial, { type: 'addMessage', chatId: '100', message: message() })).toBe(initial)
  })

  it('replaces the local id after the message is sent', () => {
    const initial = [chat({ messages: [message({ id: 'local-1', outgoing: true, status: 'pending' })] })]
    const state = chatsReducer(initial, {
      type: 'confirmMessage',
      chatId: '100',
      localId: 'local-1',
      id: 'abc',
    })

    expect(state[0].messages[0]).toMatchObject({ id: 'abc', status: 'sent' })
  })

  it('marks a message as failed', () => {
    const initial = [chat({ messages: [message({ id: 'local-1', outgoing: true, status: 'pending' })] })]
    const state = chatsReducer(initial, { type: 'failMessage', chatId: '100', localId: 'local-1' })

    expect(state[0].messages[0].status).toBe('failed')
  })

  it('only moves the status forward', () => {
    const initial = [chat({ messages: [message({ outgoing: true, status: 'read' })] })]

    expect(chatsReducer(initial, { type: 'setStatus', id: 'm1', status: 'delivered' })).toEqual(initial)

    const delivered = [chat({ messages: [message({ outgoing: true, status: 'delivered' })] })]
    const state = chatsReducer(delivered, { type: 'setStatus', id: 'm1', status: 'read' })
    expect(state[0].messages[0].status).toBe('read')
  })

  it('resets the unread counter', () => {
    const state = chatsReducer([chat({ unread: 3 })], { type: 'markRead', chatId: '100' })
    expect(state[0].unread).toBe(0)
  })
})
