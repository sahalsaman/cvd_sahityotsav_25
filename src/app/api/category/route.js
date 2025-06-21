import { NextResponse } from 'next/server';
import CategoryModel from "../../../../models/Category"

export async function GET(req) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  if (!userId)
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

 
  const data = await CategoryModel.find({ userId });
  return NextResponse.json(data);
}


export async function POST(req) {
  const { userId, category } = await req.json();
  if (!userId || !category)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

 
  const newCat = await CategoryModel.create({ userId, category });
  return NextResponse.json(newCat, { status: 201 });
}

export async function PUT(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const { category } = await req.json();

  if (!id || !category) {
    return NextResponse.json({ error: 'Missing id or category' }, { status: 400 });
  }

 
  await CategoryModel.findByIdAndUpdate(id, { category });
  return NextResponse.json({ message: 'Category updated' });
}



export async function DELETE(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
 
  await CategoryModel.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Category deleted' });
}
