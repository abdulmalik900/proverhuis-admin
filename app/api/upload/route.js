import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUD_PRESET_NAME;

    if (!cloudName || !uploadPreset) {
      return NextResponse.json(
        { success: false, error: 'Cloudinary configuration missing' },
        { status: 500 }
      );
    }

    // Create new FormData for Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', uploadPreset);

    // Upload to Cloudinary
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData
      }
    );

    const cloudinaryData = await cloudinaryResponse.json();

    if (!cloudinaryResponse.ok || cloudinaryData.error) {
      console.error('Cloudinary error:', cloudinaryData.error);
      return NextResponse.json(
        { 
          success: false, 
          error: cloudinaryData.error?.message || 'Cloudinary upload failed' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: cloudinaryData.secure_url,
      public_id: cloudinaryData.public_id
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
