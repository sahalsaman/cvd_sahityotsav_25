import { NextResponse } from 'next/server';
import CompetitionModel from "../../../../models/Competition";
import connectMongoDB from "../../../../database/db";
import CategoryModel from '../../../../models/Category';

// GET /api/competition?categoryId=abc123

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  await connectMongoDB();
  const data = await CompetitionModel.find({ categoryId });
  return NextResponse.json(data);
}


export async function POST(req) {
  await connectMongoDB();
  const { name, userId, categoryId } = await req.json();

  if (!name || !userId || !categoryId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const category = await CategoryModel.findById(categoryId);
  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }

  const competition = await CompetitionModel.create({
    userId,
    categoryId,
    category: category._id,
    name,
    published: false,
    resultAdded: false,
  });

  return NextResponse.json(competition, { status: 201 });
}



export async function PUT(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const { name } = await req.json();

  if (!id || !name) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  await connectMongoDB();

  const updated = await CompetitionModel.findByIdAndUpdate(
    id,
    { name: name },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Competition updated', competition: updated });
}


export async function DELETE(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  await connectMongoDB();

  const deleted = await CompetitionModel.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ message: 'Competition deleted' });
}
