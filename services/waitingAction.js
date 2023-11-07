import {TICKET} from "../database/index.js"
import { checkVisistor } from "./channels/handleVisitor.js";
// #TODO: This function needs to be improved to handle situation when user diconnected.
const checkAction = async ({ ticketID, visitorID }) => {
  return new Promise((resolve, reject) => {
    const timeout = 120000
    const loopTime=2000
    var time=0
    const Interval=setInterval(async () => {
        if(time>=timeout){
          clearInterval(Interval)
          reject("Waiting timeout")

        }
      try {
        console.log("axiosPost")
        if(!checkVisistor({visitorID})){
          clearInterval(Interval)
          reject("Visitor disconnected")
        }
        const res = await TICKET.findTicket({id:ticketID});
        if (res?.success && res?.data.isOpen){
          clearInterval(Interval)
           resolve(res);
        }
      } catch (err) {
        clearInterval(Interval)
        reject(err);
      }
      time+=loopTime
    }, loopTime); // Run query after 2 second
  });
};

const waitingAction = async ({ ticketID, visitorID }) => {
  try {
    const res = await checkAction({ ticketID,visitorID });
    return res;
  } catch (error) {return {success:false,message:"Error in executive action waiting",error}};
};

export { waitingAction };
