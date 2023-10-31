import CronJob from "node-cron"

const Scheduler=()=>{
    const Job=CronJob.schedule("* * * * *", () => {
        console.log("Cron is running every 1 Minute")
        const date=new Date()
        console.log(`Current Time: ${date.toLocaleString("en-US", "Asia/Delhi")}`)
      })
      Job.start()
}

export {Scheduler}
const checkTicketStatus=()=>{
  
}