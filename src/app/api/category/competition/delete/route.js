import { NextResponse } from 'next/server';

import CategoryModel from "../../../../../../models/Category"

import connectMongoDB from "../../../../../database/db";

export async function POST(req) {
  const url = new URL(req.url);
  const categoryId = url.searchParams.get('id');
  const { name } = await req.json();

  if (!categoryId || !name) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

 
   await connectMongoDB()
  const category = await CategoryModel.findById(categoryId);
  if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

  category.competitions = category.competitions.filter((comp) => comp.name !== name);
  await category.save();

  return NextResponse.json({ message: 'Competition removed' });
}
