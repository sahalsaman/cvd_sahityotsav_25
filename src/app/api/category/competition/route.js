import { NextResponse } from 'next/server';
import connectMongoDB from '../../../../../database/db';
import CategoryModel from "../../../../../models/Category"



export async function POST(req) {
  const url = new URL(req.url);
  const categoryId = url.searchParams.get('id');
  const { name } = await req.json();

  if (!categoryId || !name) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  await connectMongoDB();
  const cat = await CategoryModel.findById(categoryId);
  if (!cat) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  cat.competitions.push({ name, published: false });
  await cat.save();

  return NextResponse.json({ message: 'Competition added' });
}

export async function PUT(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const { index, newName } = await req.json();

  if (!id || newName === undefined || index === undefined) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  await connectMongoDB();

  const category = await CategoryModel.findById(id);
  if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

  if (!category.competitions[index]) {
    return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
  }

  category.competitions[index].name = newName;
  await category.save();

  return NextResponse.json({ message: 'Competition updated' });
}