import {TICKET} from "../database/index.js"
// #TODO: This function needs to be improved to handle situation when user diconnected.
const checkAction = async ({ ticketID }) => {
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

const waitingAction = async ({ ticketID },cb) => {
  try {
    const res = await checkAction({ ticketID });
    return res;
  } catch (error) {return {success:false,message:"Error in executive action waiting",error}};
};

export { waitingAction };
