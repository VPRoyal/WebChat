import { MongoClient } from 'mongodb';
import { createClient } from 'redis'
import {config} from "dotenv"
config()
// ----->>>> Mongo Client
const host=process.env.MONGO_HOST
const username=process.env.MONGO_USERNAME
const pass=process.env.MONGO_PASSWORD
const port= process.env.MONGO_PORT
const database=process.env.MONGO_DATABASE
// const uri = `mongodb://${username}:${pass}@${host}:${port}/${database}` // Replace with your MongoDB connection string
const uri=`mongodb://${host}:${port}/${database}`
const client = new MongoClient(uri, { useNewUrlParser: true });

// ------>>>>>> Redis Client
const RHost=process.env.REDIS_HOST
const RPort=process.env.REDIS_PORT
const RPass=process.env.REDIS_PASSWORD
const RedisClient = createClient({host: RHost, port: RPort, // password: RPass, // Uncomment and replace with your Redis password if authentication is required
})
let isRconnected=false
RedisClient.on("connect", ()=>{
  isRconnected=true,
  console.log("Connected to Redis")
})

async function instance() {
  if (!client.isConnected) {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }
  return client.db();
}
async function RInstance(){
  if (!isRconnected) {
    try {
      await RedisClient.connect()
    } catch (error) {
      console.error('Error connecting Redis:', error);
      throw error;
    }
  }
  return RedisClient
}
const mongoInstance=await instance()
// const redisInstance= await RInstance()
export { mongoInstance };
