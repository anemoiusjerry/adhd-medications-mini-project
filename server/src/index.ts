import dotenv from "dotenv"
import connect2Db from "./dbCnxn"
import app from "./app"

// load in env variables
dotenv.config()

const main = async () => {
  await connect2Db(process.env.ATLAS_URI || "")
  app.listen(process.env.PORT || 3000, () => {
    console.log("server started...")
  })
}
main()