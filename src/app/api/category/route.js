import { NextResponse } from 'next/server';
import CategoryModel from "../../../../models/Category"

import connectMongoDB from "../../../../database/db";
import CompetitionModel from '../../../../models/Competition';

export async function GET() {
  await connectMongoDB();

  // Fetch all categories
  const categories = await CategoryModel.find();

  // For each category, fetch competitions by categoryId
  const results = await Promise.all(
    categories.map(async (cat) => {
      const competitions = await CompetitionModel.find({ categoryId: cat._id });
      return {
        ...cat.toObject(),
        competitions,
      };
    })
  );

  return NextResponse.json(results);
}

export async function POST(req) {
  const { userId, name } = await req.json();
  if ( !name)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

     await connectMongoDB()
  const newCat = await CategoryModel.create({ userId, name });
  return NextResponse.json(newCat, { status: 201 });
}

export async function PUT(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const { name } = await req.json();

  if (!id || !name) {
    return NextResponse.json({ error: 'Missing id or category' }, { status: 400 });
  }

   await connectMongoDB()
  await CategoryModel.findByIdAndUpdate(id, { name });
  return NextResponse.json({ message: 'Category updated' });
}



export async function DELETE(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
   await connectMongoDB()
  await CategoryModel.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Category deleted' });
}
