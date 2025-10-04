import { NextResponse } from 'next/server';
import connect from '@/lib/database/db_connection';
import Author from '@/lib/model/Author';
import mongoose from 'mongoose';

// GET single author by ID
export async function GET(request, { params }) {
  try {
    await connect();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid author ID' 
      }, { status: 400 });
    }
    
    const author = await Author.findById(id).lean();
    
    if (!author) {
      return NextResponse.json({ 
        success: false, 
        error: 'Author not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: author 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching author:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// PUT - Update author
export async function PUT(request, { params }) {
  try {
    await connect();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid author ID' 
      }, { status: 400 });
    }
    
    const body = await request.json();
    const { name, bio, img, isActive } = body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (img !== undefined) updateData.img = img;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const author = await Author.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!author) {
      return NextResponse.json({ 
        success: false, 
        error: 'Author not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: author 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating author:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// DELETE author
export async function DELETE(request, { params }) {
  try {
    await connect();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid author ID' 
      }, { status: 400 });
    }
    
    const author = await Author.findByIdAndDelete(id);
    
    if (!author) {
      return NextResponse.json({ 
        success: false, 
        error: 'Author not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Author deleted successfully' 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting author:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
