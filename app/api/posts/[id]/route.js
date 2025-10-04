import { NextResponse } from 'next/server';
import connect from '@/lib/database/db_connection';
import BlogPost from '@/lib/model/BlogPost';
import mongoose from 'mongoose';

// GET single post by ID
export async function GET(request, { params }) {
  try {
    await connect();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid post ID' 
      }, { status: 400 });
    }
    
    const post = await BlogPost.findById(id)
      .populate('author_id', 'name img bio')
      .lean();
    
    if (!post) {
      return NextResponse.json({ 
        success: false, 
        error: 'Post not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: post 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// PUT - Update post
export async function PUT(request, { params }) {
  try {
    await connect();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid post ID' 
      }, { status: 400 });
    }
    
    const body = await request.json();
    const { title, metadesc, content, img, tags, author_id, status } = body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (metadesc !== undefined) updateData.metadesc = metadesc;
    if (content !== undefined) updateData.content = content;
    if (img !== undefined) updateData.img = img;
    if (tags !== undefined) updateData.tags = tags;
    if (author_id !== undefined) updateData.author_id = author_id;
    if (status !== undefined) updateData.status = status;
    
    const post = await BlogPost.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author_id', 'name img');
    
    if (!post) {
      return NextResponse.json({ 
        success: false, 
        error: 'Post not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: post 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// DELETE post
export async function DELETE(request, { params }) {
  try {
    await connect();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid post ID' 
      }, { status: 400 });
    }
    
    const post = await BlogPost.findByIdAndDelete(id);
    
    if (!post) {
      return NextResponse.json({ 
        success: false, 
        error: 'Post not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Post deleted successfully' 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
