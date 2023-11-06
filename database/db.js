import { MongoClient } from 'mongodb';
import {config} from "dotenv"
config()
const host=process.env.MONGO_HOST
const username=process.env.MONGO_USERNAME
const pass=process.env.MONGO_PASSWORD
const port= process.env.MONGO_PORT
const database=process.env.MONGO_DATABASE
console.log(host, username, pass, port, database)
// const uri = `mongodb://${username}:${pass}@${host}:${port}/${database}` // Replace with your MongoDB connection string
const uri=`mongodb://${host}:${port}/${database}`
const client = new MongoClient(uri, { useNewUrlParser: true });

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
const mongoInstance=await instance()
export { mongoInstance };
