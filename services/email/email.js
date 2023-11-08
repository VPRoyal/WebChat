import nodeMailer from "nodemailer"
// #TODO: has to create Email formats for different kind of emails 
// #TODO: Has to update database of email confirmed records.
// #TODO: Email class need to improved further.
export default class Email{
        constructor(){
            this.Transporter=null
            this.createTransporter()
        }
    verifyTransporter=()=>{
        if(this.Transporter){
            return this.Transporter.verify((err, success)=> {return err?false:true})
        } return false
    }
    createTransporter=async()=>{
        if(!this.verifyTransporter) return
        const testAccount=await nodeMailer.createTestAccount()
        this.Transporter= nodeMailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          })
    }
    sendEmail=async ({receiverID, subject, message})=>{
        try {
        const res = await this.Transporter.sendMail({
            from: '"WebChat" <webchat@sarv.com>',
            to: receiverID,
            subject: subject,
            text: message,
            // html: "<b>Hello world?</b>", // html body
          })
          if(res.messageId){
            console.log('Message sent: %s', res.messageId);
            console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(res))
            return {success:true, message:"Email sent", data:res}
          } return {success:false, error: "Email not delivered"}
        } catch (error) {
            return {success:false, error}
        }

    }
    formatTranscript=()=>{

    }
}
