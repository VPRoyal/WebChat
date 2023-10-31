import { findData } from "../test/dataOps.js";

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
        const res = findData({databaseName: "TICKET",field: "id",value: ticketID});
        if (res.success && res.data.isOpen){
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
  } catch (err) {return {success:false,message:"Error in executive action waiting",error: err}};
};

export { waitingAction };
