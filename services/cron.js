import CronJob from "node-cron"
import { EXECUTIVE, TICKET, VISITOR } from "../database"
const Scheduler=()=>{
    const Job=CronJob.schedule("* * * * *", () => {
        console.log("Cron is running every 1 Minute")
        const date=new Date()
        console.log(`Current Time: ${date.toLocaleString("en-US", "Asia/Delhi")}`)
        checkTicketStatus()
      })
      Job.start()
}

export {Scheduler}
const checkTicketStatus=()=>{
  console.log("Ticket status check running....")
  const tickets=global.TICKETS
  if(tickets){
    for (const [key, value] of tickets.entries()) {
      const timeDiff= ((Date.now()-value.lastUpdated)/(1000*60))
      if(timeDiff>=20){
          EXECUTIVE.closeTicket({ticketID:key, userID: value.executiveID})
          VISITOR.closeTicket({visitorID: value.visitorID})
          TICKET.closeTicket({id:key})
      }
    }
    
  }
  console.log("Ticket status check completed.")
}