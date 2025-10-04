import { NextResponse } from 'next/server';
import connect from '@/lib/database/db_connection';
import Author from '@/lib/model/Author';

// GET all authors
export async function GET(request) {
  try {
    await connect();
    
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    
    const filter = {};
    if (isActive !== null) {
      filter.isActive = isActive === 'true';
    }
    
    const authors = await Author.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({ 
      success: true, 
      data: authors 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// POST - Create new author
export async function POST(request) {
  try {
    await connect();
    
    const body = await request.json();
    const { name, bio, img, isActive } = body;
    
    if (!name) {
      return NextResponse.json({ 
        success: false, 
        error: 'Author name is required' 
      }, { status: 400 });
    }
    
    const author = await Author.create({
      name,
      bio: bio || '',
      img: img || '',
      isActive: isActive !== undefined ? isActive : true
    });
    
    return NextResponse.json({ 
      success: true, 
      data: author 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
