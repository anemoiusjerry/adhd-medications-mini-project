import mongoose from 'mongoose'

// connects to mongodb server, use single connection for entire app
const connect2Db = async (uri: string) => {
  try {
    await mongoose.connect(uri);
  } catch(err) {
    console.error('Could not connect to database, exiting...')
    process.exit(1);  // 1 indicates failure
  }
}

export default connect2Db