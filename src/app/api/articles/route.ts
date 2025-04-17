import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Get form data
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const author = formData.get('author') as string;
    const is_featured = formData.get('is_featured') === 'true';
    const image = formData.get('image') as File;

    // Handle image upload
    let imagePath = '';
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create a unique filename
      const filename = `${Date.now()}-${image.name}`;
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'articles');
      
      // Save the file
      await writeFile(path.join(uploadDir, filename), buffer);
      imagePath = `/images/articles/${filename}`;
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from('articles')
      .insert([
        {
          title,
          content,
          category,
          author,
          image_url: imagePath || null,
          is_featured
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving to Supabase:', error);
      return NextResponse.json(
        { error: 'Failed to save article to database' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      article: data
    });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
} 