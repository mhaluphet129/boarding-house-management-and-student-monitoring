import User from "../../../database/models/User";
import dbConnect from "../../../database/dbConnect";

export default async function handler(req, res) {
  try {
    if (req.method !== "PUT") throw new Error("Invalid method");

    await dbConnect();

    const { _id } = req.body;

    let user = await User.findByIdAndUpdate(
      _id,
      { $set: { ...req.body } },
      { returnOriginal: false }
    );
    res.json({ status: 200, message: "Updated successfully", user });
  } catch (err) {
    res.json({ status: 500, success: false, message: err });
  }
}
