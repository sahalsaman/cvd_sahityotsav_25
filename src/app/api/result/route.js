import { NextResponse } from "next/server";
import ResultModel from "../../../../models/Result";
import CategoryModel from "../../../../models/Category";
import connectMongoDB from "../../../../database/db";
// ✅ ADD Result
export async function POST(req) {
  const data = await req.json();
   await connectMongoDB()
  const result = await ResultModel.create(data);

  // Update Category's resultAdded flag
  const category = await CategoryModel.findOne({ category: data.category });
  if (category) {
    const index = category.competitions.findIndex(item => item.name === data.compotition);
    if (index !== -1) {
      category.competitions[index].resultAdded = true;
      await category.save();
    }
  }

  return NextResponse.json(result, { status: 201 });
}

// ✅ GET Results
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
   await connectMongoDB()
  const results = await ResultModel.find({ userId });
  return NextResponse.json(results);
}

// ✅ EDIT Result
export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const publish = searchParams.get('publish');
   await connectMongoDB()
  if (publish) {
    const updated = await ResultModel.findByIdAndUpdate(id, {
      publish: publish === "true"
    }, { new: true });
    return NextResponse.json(updated);
  }

  const data = await req.json();

  const oldResult = await ResultModel.findById(id);
  const updated = await ResultModel.findByIdAndUpdate(id, data, { new: true });

  // Check and update old category competition resultAdded = false if no more result exists
  if (oldResult) {
    const others = await ResultModel.find({
      _id: { $ne: id },
      category: oldResult.category,
      compotition: oldResult.compotition
    });
    if (others.length === 0) {
      const oldCategory = await CategoryModel.findOne({ category: oldResult.category });
      const oldIndex = oldCategory?.competitions.findIndex(item => item.name === oldResult.compotition);
      if (oldCategory && oldIndex !== -1) {
        oldCategory.competitions[oldIndex].resultAdded = false;
        await oldCategory.save();
      }
    }
  }

  // Set resultAdded = true for new competition
  const category = await CategoryModel.findOne({ category: data.category });
  const index = category?.competitions.findIndex(item => item.name === data.compotition);
  if (category && index !== -1) {
    category.competitions[index].resultAdded = true;
    await category.save();
  }

  return NextResponse.json(updated);
}

// ✅ DELETE Result
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
   await connectMongoDB()
  const result = await ResultModel.findByIdAndDelete(id);

  if (result) {
    const others = await ResultModel.find({
      category: result.category,
      compotition: result.compotition
    });

    if (others.length === 0) {
      
      const category = await CategoryModel.findOne({ category: result.category });
      const index = category?.competitions.findIndex(item => item.name === result.compotition);
      if (category && index !== -1) {
        category.competitions[index].resultAdded = false;
        await category.save();
      }
    }
  }

  return NextResponse.json({ message: 'Deleted' });
}
