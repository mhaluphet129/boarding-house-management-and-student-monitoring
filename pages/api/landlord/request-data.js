import Request from "../../../database/models/Request";
import dbConnect from "../../../database/dbConnect";
import Tenant from "../../../database/models/Tenant";
import mongoose from "mongoose";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    let { type } = req.query;
    let data = [];

    if (!["request", "tenants"].includes(type)) throw new Error();

    let ownerId = JSON.parse(req.cookies.currentUser)._id;
    if (type === "request") {
      data = await Request.aggregate([
        {
          $match: {
            status: "pending",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "studentId",
            foreignField: "_id",
            as: "studentId",
          },
        },
        {
          $lookup: {
            from: "establishments",
            localField: "establishmentId",
            foreignField: "_id",
            pipeline: [
              {
                $match: { ownerId: mongoose.Types.ObjectId(ownerId) },
              },
            ],
            as: "establishmentId",
          },
        },
        {
          $unwind: "$establishmentId",
        },
        {
          $unwind: "$studentId",
        },
      ]);
    } else if (type === "tenants") {
      // need to review this, no owner id filtering
      data = await Tenant.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "studentId",
            foreignField: "_id",
            as: "studentId",
          },
        },
        {
          $lookup: {
            from: "establishments",
            localField: "establishmentId",
            foreignField: "_id",
            as: "establishmentId",
            pipeline: [
              {
                $match: { ownerId: mongoose.Types.ObjectId(ownerId) },
              },
            ],
          },
        },
        {
          $unwind: "$establishmentId",
        },
        {
          $unwind: "$studentId",
        },
      ]);
    }

    res.json({ data, status: 200, message: `Successfully fetch ${type}` });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}