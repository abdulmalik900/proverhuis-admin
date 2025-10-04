# 📚 Proverhuis Blog API Guide (Read Only)

Simple guide to fetch data from the blog API in your frontend.

**API URL:** `https://proverhuis-admin.vercel.app/api`

---

## 👥 AUTHORS

### Get All Authors
Get list of all authors.

```javascript
fetch('https://proverhuis-admin.vercel.app/api/authors')
  .then(res => res.json())
  .then(data => {
    console.log(data.data); // Array of authors
  });
```

**You will get:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "abc123",
      "name": "John Doe",
      "bio": "Web developer",
      "imageUrl": "https://cloudinary.com/image.jpg",
      "isActive": true
    }
  ]
}
```

---

### Get Single Author
Get details of one specific author.

```javascript
const authorId = 'abc123';

fetch(`http://localhost:3001/api/authors/${authorId}`)
  .then(res => res.json())
  .then(data => {
    console.log(data.data); // Single author details
  });
```

**You will get:**
```json
{
  "success": true,
  "data": {
    "_id": "abc123",
    "name": "John Doe",
    "bio": "Web developer",
    "imageUrl": "https://cloudinary.com/image.jpg",
    "isActive": true
  }
}
```

---

## 📝 BLOG POSTS

### Get All Posts
Get list of all blog posts.

```javascript
fetch('https://proverhuis-admin.vercel.app/api/posts')
  .then(res => res.json())
  .then(data => {
    console.log(data.data); // Array of posts
  });
```

**You will get:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "post123",
      "title": "My First Blog Post",
      "slug": "my-first-blog-post",
      "content": "<h1>Hello World</h1><p>This is my post...</p>",
      "excerpt": "Short description of the post",
      "author": {
        "_id": "author123",
        "name": "John Doe",
        "imageUrl": "https://author-image.jpg"
      },
      "featuredImage": "https://post-image.jpg",
      "tags": ["javascript", "react", "nextjs"],
      "status": "published",
      "metaDescription": "SEO description",
      "publishedAt": "2024-10-04T10:30:00.000Z"
    }
  ]
}
```

---

### Get Single Post
Get details of one specific blog post.

```javascript
const postId = 'post123';

fetch(`https://proverhuis-admin.vercel.app/api/posts/${postId}`)
  .then(res => res.json())
  .then(data => {
    console.log(data.data); // Single post details
  });
```

**You will get:**
```json
{
  "success": true,
  "data": {
    "_id": "post123",
    "title": "My First Blog Post",
    "slug": "my-first-blog-post",
    "content": "<h1>Hello World</h1><p>This is my post...</p>",
    "excerpt": "Short description of the post",
    "author": {
      "_id": "author123",
      "name": "John Doe",
      "bio": "Web developer",
      "imageUrl": "https://author-image.jpg"
    },
    "featuredImage": "https://post-image.jpg",
    "tags": ["javascript", "react", "nextjs"],
    "status": "published",
    "metaDescription": "SEO description",
    "publishedAt": "2024-10-04T10:30:00.000Z"
  }
}
```

---

## 📋 POST STATUS

Posts can have 3 status values:

- **`draft`** - Post is not published yet (hidden from public)
- **`published`** - Post is live and visible to everyone
- **`archived`** - Post is hidden but not deleted

---

## ✅ RESPONSE FORMAT

All API responses have this format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## 🔄 COMPLETE EXAMPLES

### Example 1: Display All Authors

```javascript
async function displayAuthors() {
  try {
    const response = await fetch('https://proverhuis-admin.vercel.app/api/authors');
    const result = await response.json();
    
    if (result.success) {
      const authors = result.data;
      authors.forEach(author => {
        console.log(`Name: ${author.name}`);
        console.log(`Bio: ${author.bio}`);
        console.log(`Image: ${author.imageUrl}`);
      });
    } else {
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error('Something went wrong:', error);
  }
}
```

---

### Example 2: Display All Blog Posts

```javascript
async function displayPosts() {
  try {
    const response = await fetch('https://proverhuis-admin.vercel.app/api/posts');
    const result = await response.json();
    
    if (result.success) {
      const posts = result.data;
      posts.forEach(post => {
        console.log(`Title: ${post.title}`);
        console.log(`Author: ${post.author.name}`);
        console.log(`Tags: ${post.tags.join(', ')}`);
        console.log(`Status: ${post.status}`);
      });
    } else {
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error('Something went wrong:', error);
  }
}
```

---

### Example 3: Get Only Published Posts

```javascript
async function getPublishedPosts() {
  try {
    const response = await fetch('https://proverhuis-admin.vercel.app/api/posts');
    const result = await response.json();
    
    if (result.success) {
      const publishedPosts = result.data.filter(post => post.status === 'published');
      console.log('Published posts:', publishedPosts);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

### Example 4: Get Posts by Specific Author

```javascript
async function getPostsByAuthor(authorId) {
  try {
    const response = await fetch('https://proverhuis-admin.vercel.app/api/posts');
    const result = await response.json();
    
    if (result.success) {
      const authorPosts = result.data.filter(post => post.author._id === authorId);
      console.log('Posts by this author:', authorPosts);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

### Example 5: Get Posts by Tag

```javascript
async function getPostsByTag(tagName) {
  try {
    const response = await fetch('https://proverhuis-admin.vercel.app/api/posts');
    const result = await response.json();
    
    if (result.success) {
      const taggedPosts = result.data.filter(post => post.tags.includes(tagName));
      console.log(`Posts with tag "${tagName}":`, taggedPosts);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

### Example 6: Get Single Post Details

```javascript
async function getPostDetails(postId) {
  try {
    const response = await fetch(`https://proverhuis-admin.vercel.app/api/posts/${postId}`);
    const result = await response.json();
    
    if (result.success) {
      const post = result.data;
      console.log('Post Title:', post.title);
      console.log('Content:', post.content);
      console.log('Author:', post.author.name);
      console.log('Published:', post.publishedAt);
    } else {
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## 🎯 QUICK REFERENCE

| What | Method | URL |
|------|--------|-----|
| Get all authors | GET | `/api/authors` |
| Get single author | GET | `/api/authors/:id` |
| Get all posts | GET | `/api/posts` |
| Get single post | GET | `/api/posts/:id` |

---

## 📊 DATA STRUCTURE

### Author Object
```json
{
  "_id": "abc123",
  "name": "John Doe",
  "bio": "Web developer and blogger",
  "imageUrl": "https://cloudinary.com/image.jpg",
  "isActive": true
}
```

### Post Object
```json
{
  "_id": "post123",
  "title": "My Blog Post",
  "slug": "my-blog-post",
  "content": "<h1>Title</h1><p>Content...</p>",
  "excerpt": "Short summary",
  "author": {
    "_id": "author123",
    "name": "John Doe",
    "bio": "Web developer",
    "imageUrl": "https://author-image.jpg"
  },
  "featuredImage": "https://post-image.jpg",
  "tags": ["javascript", "react"],
  "status": "published",
  "metaDescription": "SEO description",
  "publishedAt": "2024-10-04T10:30:00.000Z"
}
```

---

## 💡 TIPS

- Always check `success` field in response
- If `success: false`, check the `error` field for error message
- MongoDB IDs are 24 characters long (like: `670123abc456def789`)
- Author information is automatically included in post data
- Filter posts by status: `draft`, `published`, or `archived`
- Use JavaScript `.filter()` to get posts by author, tag, or status
- Sort posts by date: `posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))`

---

**Need Help?** Check the console for error messages!

**Happy Coding! 🚀**
