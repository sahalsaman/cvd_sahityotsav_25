import { NextResponse } from "next/server";
import TeamModel from "../../../../models/Team";
import connectMongoDB from "../../../../database/db";


export async function GET() {
  try {
     await connectMongoDB()
    const teams = await TeamModel.find();
    return NextResponse.json(teams);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch teams", details: err }, { status: 500 });
  }
}

// POST - Add a new team
export async function POST(request) {
 
  await connectMongoDB()
  const body = await request.json();
console.log(body);
  try {
    const team = await TeamModel.create(body);
    return NextResponse.json({ message: "Team added", team }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to add team", details: err }, { status: 400 });
  }
}

// PUT - Update team by id (pass id as query param)
export async function PUT(request) {
 
  const id = request.nextUrl.searchParams.get("id");
   await connectMongoDB()
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: "Missing team ID" }, { status: 400 });
  }

  try {
    const updated = await TeamModel.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ message: "Team updated", updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update team", details: err }, { status: 400 });
  }
}

// DELETE - Delete team by id (pass id as query param)
export async function DELETE(request) {
 
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing team ID" }, { status: 400 });
  }

  try {
     await connectMongoDB()
    await TeamModel.findByIdAndDelete(id);
    return NextResponse.json({ message: "Team deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete team", details: err }, { status: 500 });
  }
}
