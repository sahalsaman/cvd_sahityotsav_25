import moment from "moment";
import connectMongoDB from "../../../../database/db";
import { NextResponse } from "next/server";
import ResultModel from "../../../../models/Result";


export async function POST(req) {
  const data = await req.json();
  await connectMongoDB();
  const result = await ResultModel.create(data);
  return NextResponse.json(result, { status: 201 });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  await connectMongoDB();
  const results = await ResultModel.find({ userId });
  return NextResponse.json(results);
}


export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const data = await req.json();
  await connectMongoDB();
  const updated = await ResultModel.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updated);
}


export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await connectMongoDB();
  await ResultModel.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Deleted' });
}
