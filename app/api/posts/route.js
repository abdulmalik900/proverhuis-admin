import { NextResponse } from 'next/server';
import connect from '@/lib/database/db_connection';
import BlogPost from '@/lib/model/BlogPost';

// GET all blog posts
export async function GET(request) {
  try {
    await connect();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const authorId = searchParams.get('author_id');
    
    const filter = {};
    if (status) filter.status = status;
    if (authorId) filter.author_id = authorId;
    
    const posts = await BlogPost.find(filter)
      .populate('author_id', 'name img')
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({ 
      success: true, 
      data: posts 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// POST - Create new blog post
export async function POST(request) {
  try {
    await connect();
    
    const body = await request.json();
    const { title, metadesc, content, img, tags, author_id, status } = body;
    
    if (!title || !content || !author_id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title, content, and author are required' 
      }, { status: 400 });
    }
    
    const post = await BlogPost.create({
      title,
      metadesc: metadesc || '',
      content,
      img: img || '',
      tags: tags || [],
      author_id,
      status: status || 'draft'
    });
    
    const populatedPost = await BlogPost.findById(post._id)
      .populate('author_id', 'name img')
      .lean();
    
    return NextResponse.json({ 
      success: true, 
      data: populatedPost 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
