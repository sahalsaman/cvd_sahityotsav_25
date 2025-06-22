import { NextResponse } from "next/server";
import ResultModel from "../../../../models/Result";
import CompetitionModel from "../../../../models/Competition";
import connectMongoDB from "../../../../database/db";
import mongoose from "mongoose";


export async function POST(req) {
  await connectMongoDB();
  const data = await req.json();

  // Validate required fields
  const requiredFields = [
    'userId', 'categoryId', 'competitionId',
    'resultNumber', 'f_name', 'f_team'
  ];
  const missingFields = requiredFields.filter(field => !data[field]);
  if (missingFields.length > 0) {
    return NextResponse.json(
      { error: `Missing fields: ${missingFields.join(", ")}` },
      { status: 400 }
    );
  }

  data.competition = new mongoose.Types.ObjectId(data.competitionId);
  data.category = new mongoose.Types.ObjectId(data.categoryId);

  // ✅ Create result
  const result = await ResultModel.create(data);

  // ✅ Update Competition: set resultAdded = true
  if (data.competitionId) {
    await CompetitionModel.findByIdAndUpdate(
      data.competitionId,
      { resultAdded: true },
      { new: true }
    );
  }

  return NextResponse.json(result, { status: 201 });
}


export async function GET(req) {
  await connectMongoDB();

  const { searchParams } = new URL(req.url);
  const competitionId = searchParams.get("competitionId");

  const filter = competitionId ? { competitionId } : {};

  const results = await ResultModel.find(filter)
    .populate("category", "name")
    .populate("competition", "name");

  return NextResponse.json(results);
}


// ✅ EDIT Result
export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const publish = searchParams.get("publish");

  await connectMongoDB();

  if (publish) {
    // Only updating publish status
    const updated = await ResultModel.findByIdAndUpdate(
      id,
      { published: publish === "true" },
      { new: true }
    );

    if (updated?.competitionId) {
      await CompetitionModel.findByIdAndUpdate(
        updated.competitionId,
        { published: publish === "true" }
      );
    }

    return NextResponse.json(updated);
  }

  // Full update
  const data = await req.json();

  const oldResult = await ResultModel.findById(id);
  const updated = await ResultModel.findByIdAndUpdate(id, data, { new: true });

  // 🧹 Clean old competition's resultAdded if no other results exist
  if (oldResult?.competitionId && oldResult.competitionId !== data.competitionId) {
    const others = await ResultModel.find({
      _id: { $ne: id },
      competitionId: oldResult.competitionId,
    });

    if (others.length === 0) {
      await CompetitionModel.findByIdAndUpdate(oldResult.competitionId, {
        resultAdded: false,
      });
    }
  }

  // ✅ Mark new competition's resultAdded = true
  if (data.competitionId) {
    await CompetitionModel.findByIdAndUpdate(data.competitionId, {
      resultAdded: true,
    });
  }

  return NextResponse.json(updated);
}

// ✅ DELETE Result
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await connectMongoDB();

  const result = await ResultModel.findByIdAndDelete(id);

  if (result?.competitionId) {
    const others = await ResultModel.find({
      competitionId: result.competitionId,
    });

    if (others.length === 0) {
      await CompetitionModel.findByIdAndUpdate(result.competitionId, {
        resultAdded: false,
      });
    }
  }

  return NextResponse.json({ message: "Deleted" });
}
