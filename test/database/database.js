import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import path from 'path'

const currentDir = path.dirname(new URL(import.meta.url).pathname)
const executivePath= path.resolve(currentDir, 'executive.json')
const visitorPath= path.resolve(currentDir, 'visitor.json')
const ticketPath= path.resolve(currentDir, 'ticket.json')
const messagePath= path.resolve(currentDir, 'message.json')
const chatPath= path.resolve(currentDir, 'chat.json')
// Create and configure the first db instance
const executiveAdapter = new JSONFileSync(executivePath)
const executiveData = new LowSync(executiveAdapter, [])

// Create and configure the first db instance
const visitorAdapter = new JSONFileSync(visitorPath)
const visitorData = new LowSync(visitorAdapter, [])

// Create and configure the first db instance
const ticketAdapter = new JSONFileSync(ticketPath)
const ticketData = new LowSync(ticketAdapter, [])

// Create and configure the first db instance
const messageAdapter = new JSONFileSync(messagePath)
const messageData = new LowSync(messageAdapter, [])

// Create and configure the first db instance
const chatAdapter = new JSONFileSync(chatPath)
const chatData = new LowSync(chatAdapter, [])


const dataMap={"EXECUTIVE":executiveData, "VISITOR":visitorData, "TICKET":ticketData,"MESSAGE":messageData, "CHAT":chatData}
export {dataMap}

