import pkg from 'better-sse';
const {createSession} = pkg;

const session = async (req, res, next) =>{
        const session = await createSession(req, res);
        res.sse = session;
        next();
    }
export default session