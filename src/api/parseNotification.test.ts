import { describe, expect, it } from 'vitest'
import { parseNotification } from './parseNotification'

describe('parseNotification', () => {
  it('parses an incoming text message', () => {
    const event = parseNotification({
      typeWebhook: 'incomingMessageReceived',
      idMessage: 'abc',
      timestamp: 1_700_000_000,
      senderData: { chatId: '123', chatName: 'Chat', senderName: 'Ivan', senderContactName: 'Ivan P.' },
      messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'hi' } },
    })

    expect(event).toEqual({
      type: 'message',
      chatId: '123',
      title: 'Ivan P.',
      message: { id: 'abc', text: 'hi', timestamp: 1_700_000_000, outgoing: false, status: undefined },
    })
  })

  it('parses an extended text message', () => {
    const event = parseNotification({
      typeWebhook: 'incomingMessageReceived',
      idMessage: 'abc',
      senderData: { chatId: '123' },
      messageData: { typeMessage: 'extendedTextMessage', extendedTextMessageData: { text: 'link' } },
    })

    expect(event?.type === 'message' && event.message.text).toBe('link')
  })

  it('marks messages sent from the phone as outgoing', () => {
    const event = parseNotification({
      typeWebhook: 'outgoingMessageReceived',
      idMessage: 'abc',
      senderData: { chatId: '123', chatName: 'Ivan' },
      messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'hi' } },
    })

    expect(event).toMatchObject({ title: 'Ivan', message: { outgoing: true, status: 'sent' } })
  })

  it('skips non-text messages', () => {
    const event = parseNotification({
      typeWebhook: 'incomingMessageReceived',
      idMessage: 'abc',
      senderData: { chatId: '123' },
      messageData: { typeMessage: 'imageMessage' },
    })

    expect(event).toBeNull()
  })

  it('parses status updates', () => {
    expect(
      parseNotification({ typeWebhook: 'outgoingMessageStatus', idMessage: 'abc', status: 'read' }),
    ).toEqual({
      type: 'status',
      idMessage: 'abc',
      status: 'read',
    })
  })

  it('treats unknown statuses as failed', () => {
    const event = parseNotification({
      typeWebhook: 'outgoingMessageStatus',
      idMessage: 'abc',
      status: 'noAccount',
    })
    expect(event).toMatchObject({ status: 'failed' })
  })

  it('ignores other webhook types', () => {
    expect(parseNotification({ typeWebhook: 'stateInstanceChanged' })).toBeNull()
  })
})
