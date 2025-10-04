# Blog Management System - Admin Panel

A complete CRUD application for managing blog posts and authors built with Next.js 15, React 19, Mongoose, and React Quill.

## 🚀 Features

- ✅ Full CRUD operations for Authors and Blog Posts
- ✅ Rich text editor (React Quill) for blog content
- ✅ Clean and organized folder structure
- ✅ Responsive UI with Tailwind CSS
- ✅ MongoDB integration with Mongoose
- ✅ RESTful API endpoints
- ✅ Image URL support for authors and posts
- ✅ Status management (Draft, Published, Archived)
- ✅ Tag system for posts
- ✅ Auto-generated slugs from titles

## 📁 Project Structure

```
admin-proverhuis/
├── app/
│   ├── api/
│   │   ├── authors/
│   │   │   ├── route.js          # GET all, POST new author
│   │   │   └── [id]/
│   │   │       └── route.js      # GET, PUT, DELETE single author
│   │   └── posts/
│   │       ├── route.js          # GET all, POST new post
│   │       └── [id]/
│   │           └── route.js      # GET, PUT, DELETE single post
│   ├── admin/
│   │   ├── page.js               # Dashboard with stats
│   │   ├── authors/
│   │   │   └── page.js           # Authors management UI
│   │   └── posts/
│   │       └── page.js           # Posts management UI
│   └── ...
├── components/
│   ├── Table.jsx                 # Reusable table component
│   ├── Modal.jsx                 # Reusable modal component
│   └── RichTextEditor.jsx        # Rich text editor wrapper
├── lib/
│   ├── database/
│   │   └── db_connection.js      # MongoDB connection
│   └── model/
│       ├── Author.js             # Author schema
│       └── BlogPost.js           # BlogPost schema
└── package.json
```

## 🛠️ API Endpoints

### Authors API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/authors` | Get all authors (optional query: `?isActive=true`) |
| POST | `/api/authors` | Create new author |
| GET | `/api/authors/[id]` | Get single author by ID |
| PUT | `/api/authors/[id]` | Update author by ID |
| DELETE | `/api/authors/[id]` | Delete author by ID |

**Author Schema:**
```json
{
  "name": "string (required)",
  "bio": "string",
  "img": "string (URL)",
  "isActive": "boolean"
}
```

### Posts API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts (optional: `?status=published&author_id=xxx`) |
| POST | `/api/posts` | Create new post |
| GET | `/api/posts/[id]` | Get single post by ID |
| PUT | `/api/posts/[id]` | Update post by ID |
| DELETE | `/api/posts/[id]` | Delete post by ID |

**BlogPost Schema:**
```json
{
  "title": "string (required)",
  "metadesc": "string",
  "slug": "string (auto-generated)",
  "content": "string (required, rich text HTML)",
  "img": "string (URL)",
  "tags": ["array of strings"],
  "author_id": "ObjectId (required)",
  "status": "draft | published | archived",
  "publishedAt": "date (auto-set when published)"
}
```

## 🎯 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Environment Variables

Create a `.env.local` file:

```env
USER_NAME=your_mongodb_username
PASSWORD=your_mongodb_password
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Access the Application

- **Admin Dashboard:** http://localhost:3000/admin
- **Authors Management:** http://localhost:3000/admin/authors
- **Posts Management:** http://localhost:3000/admin/posts

## 📝 Usage

### Managing Authors

1. Navigate to `/admin/authors`
2. Click "Add New Author" to create an author
3. Fill in name, bio, image URL, and set active status
4. Edit or delete authors using the action buttons

### Managing Blog Posts

1. Navigate to `/admin/posts`
2. Click "Add New Post" to create a post
3. Fill in:
   - Title (auto-generates slug)
   - Meta description for SEO
   - Select author from dropdown
   - Set status (Draft/Published/Archived)
   - Add featured image URL
   - Add tags (comma-separated)
   - Write content using the rich text editor
4. Edit or delete posts using the action buttons

### Rich Text Editor Features

- Headers (H1-H6)
- Bold, Italic, Underline, Strikethrough
- Ordered and Bulleted lists
- Text color and background color
- Text alignment
- Links and images
- Blockquotes and code blocks

## 🔒 Database Schema Features

### Author Model
- Virtual field for posts count
- Index on name for performance
- Timestamps (createdAt, updatedAt)

### BlogPost Model
- Auto-generated slug from title
- Virtual field to populate author details
- Auto-set publishedAt when status changes to published
- Indexes on slug, author_id, status, tags, publishedAt
- Timestamps (createdAt, updatedAt)

## 🎨 UI Features

- Clean, modern design with Tailwind CSS
- Responsive tables with proper data display
- Modal forms for create/edit operations
- Image previews
- Status badges with color coding
- Confirmation dialogs for delete operations
- Loading states

## 📦 Tech Stack

- **Framework:** Next.js 15.5.4
- **React:** 19.1.0
- **Database:** MongoDB with Mongoose 8.19.0
- **Rich Text Editor:** React Quill 2.0.0
- **Styling:** Tailwind CSS 4
- **Language:** JavaScript (ES6+)

## 🚀 Deployment Notes

1. Ensure environment variables are set in production
2. Build the application: `npm run build`
3. Start production server: `npm start`
4. Make sure MongoDB connection string is accessible from production

## 📄 License

This project is part of the admin-proverhuis blog management system.
