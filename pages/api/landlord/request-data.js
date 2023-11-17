import Request from "../../../database/models/Request";
import dbConnect from "../../../database/dbConnect";
import Tenant from "../../../database/models/Tenant";
import mongoose, { mongo } from "mongoose";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") throw new Error("Invalid method");
    await dbConnect();

    let { type, id } = req.query;
    let data = [];

    if (!["request", "tenants"].includes(type)) throw new Error();

    let ownerId = JSON.parse(req.cookies.currentUser)._id;
    if (type === "request") {
      data = await Request.aggregate([
        {
          $match: {
            $and: [
              { status: "pending" },
              [null, undefined, ""].includes(id)
                ? {}
                : { establishmentId: mongoose.Types.ObjectId(id) },
            ],
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
      data = await Tenant.aggregate([
        {
          $match: {
            establishmentId: mongoose.Types.ObjectId(id),
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

    res.json({ data, status: 200 });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, success: false, message: err });
  }
}
