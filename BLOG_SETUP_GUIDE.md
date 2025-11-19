# Blog Setup Guide - CaseValue.law

## ✅ What's Been Completed

I've successfully implemented a complete Sanity.io blog system for your website. Here's what's ready:

### 🎯 Implementation Summary

1. **Sanity Studio (CMS)** - Separate project at `/Users/rshao/casevalue-blog-studio/`
2. **Blog Components** - BlogPage (listing) and BlogPostPage (individual posts)
3. **React Router** - Added routing for `/blog` and `/blog/:slug`
4. **Navigation** - Added "Blog" link to the navigation bar
5. **Sanity Client** - Configured for fetching blog posts

---

## 🚀 Next Steps to Complete Setup

### Step 1: Create Your Sanity Project (5 minutes)

1. **Go to [sanity.io](https://www.sanity.io) and sign up/login**
   - Use your email or GitHub account

2. **Create a new project:**
   - Click "Create project" in the dashboard
   - Name: **"CaseValue Blog"**
   - Plan: **Free** (perfect for your needs)
   - Click "Create"

3. **Copy your Project ID:**
   - You'll see something like: `abc12xyz`
   - Keep this handy for the next steps

### Step 2: Configure Your Sanity Studio (2 minutes)

1. **Open the Sanity Studio config:**
   ```bash
   cd /Users/rshao/casevalue-blog-studio
   ```

2. **Edit `sanity.config.js`:**
   - Find line 8: `projectId: 'YOUR_PROJECT_ID',`
   - Replace `YOUR_PROJECT_ID` with your actual project ID

3. **Install Studio dependencies:**
   ```bash
   npm install
   ```

### Step 3: Connect React App to Sanity (1 minute)

1. **Edit `/Users/rshao/casevalue.law/src/utils/sanityClient.js`:**
   - Find line 13: `projectId: 'YOUR_PROJECT_ID',`
   - Replace `YOUR_PROJECT_ID` with your actual project ID

### Step 4: Start the Sanity Studio (1 minute)

1. **Start the Studio locally:**
   ```bash
   cd /Users/rshao/casevalue-blog-studio
   npm run dev
   ```

2. **Studio opens at:** `http://localhost:3333`

3. **Login with your Sanity account** (same as step 1)

### Step 5: (Optional) Deploy the Studio

To access your CMS from anywhere:

```bash
cd /Users/rshao/casevalue-blog-studio
npm run deploy
```

This creates a hosted version at `https://your-project.sanity.studio`

---

## 📝 How to Create Your First Blog Post

1. **Open Sanity Studio** (localhost:3333 or your deployed URL)

2. **Click "Blog Post" in the sidebar**

3. **Click the "+" icon to create new post**

4. **Fill in the fields:**
   - **Title:** "Understanding Texas Statute of Limitations"
   - **Slug:** Click "Generate" (creates URL-friendly version)
   - **Author:** Your name
   - **Published Date:** Auto-filled (you can change it)
   - **Excerpt:** Write a short summary (150-160 characters)
   - **Main Image:** Upload a hero image (drag and drop)
   - **Categories:** Select relevant categories
   - **Body Content:** Write your article using the rich text editor
   - **SEO Settings:** Add meta title, description, and keywords

5. **Click "Publish"**

6. **Visit your blog:** `http://localhost:3000/blog`

---

## 🎨 Blog Features Implemented

### Blog Listing Page (`/blog`)
- Grid layout of all posts
- Category filtering
- Featured images
- Post excerpts
- Author and date metadata
- Responsive design matching your site

### Individual Post Page (`/blog/post-slug`)
- Full article with rich text formatting
- Hero image
- Categories
- Author info and date
- Related posts section
- SEO meta tags
- Legal disclaimer

### Navigation
- "Blog" link in header (with book icon)
- Active state highlighting
- Works on mobile and desktop

---

## 📁 File Structure

### React App (Main Website)
```
src/
├── components/
│   ├── pages/
│   │   ├── BlogPage.jsx          # Blog listing
│   │   └── BlogPostPage.jsx      # Individual post
│   └── Navigation.jsx             # Updated with blog link
├── utils/
│   └── sanityClient.js            # Sanity configuration
├── Router.jsx                      # Routing setup
└── index.js                        # App entry point (updated)
```

### Sanity Studio (CMS)
```
casevalue-blog-studio/
├── schemas/
│   ├── blogPost.js                # Blog post schema
│   └── index.js                   # Schema exports
├── sanity.config.js               # Studio configuration
├── package.json                   # Dependencies
└── README.md                      # Detailed instructions
```

---

## 🎯 Blog Post Schema

Each blog post includes:
- ✅ Title (required)
- ✅ Slug (URL-friendly, auto-generated)
- ✅ Author (required)
- ✅ Published Date (required)
- ✅ Excerpt (required, max 250 chars)
- ✅ Main Image (with alt text)
- ✅ Categories (12 pre-defined options)
- ✅ Body Content (rich text with images, headings, lists, links)
- ✅ SEO Settings (meta title, description, keywords)
- ✅ Featured toggle (for highlighting posts)

### Available Categories:
- Personal Injury
- Medical Malpractice
- Motor Vehicle Accidents
- Wrongful Death
- Dog Bites
- Premises Liability
- Product Liability
- Employment Law
- Civil Rights
- Texas Law
- Legal Tips
- Case Studies

---

## 💰 Sanity Free Tier (More Than Enough)

- ✅ 3 users
- ✅ 10,000 documents (blog posts)
- ✅ 10GB assets (images/videos)
- ✅ 100,000 API requests/month
- ✅ 1GB bandwidth/month

This supports:
- Hundreds of blog posts
- Multiple posts per week for years
- Moderate to high traffic

---

## 🔧 Development Workflow

### Daily Blog Publishing:
1. Open Sanity Studio (`npm run dev` or deployed URL)
2. Click "Create new Blog Post"
3. Write content in rich text editor
4. Upload images
5. Fill SEO fields
6. Click "Publish"
7. **Post appears on your site immediately!** 🎉

No rebuild, no deploy, no git commits needed!

---

## 🌐 Testing the Blog

### Local Testing:
1. **Main site:** `http://localhost:3000`
2. **Blog listing:** `http://localhost:3000/blog`
3. **Sanity Studio:** `http://localhost:3333`

### Testing Checklist:
- [ ] Click "Blog" in navigation
- [ ] See blog listing page (will be empty until you create posts)
- [ ] Create first post in Sanity Studio
- [ ] Refresh blog page to see new post
- [ ] Click post to view full article
- [ ] Test category filters
- [ ] Check responsive design on mobile

---

## 🚨 Important Notes

1. **Project ID is required** - The blog won't work until you add your Sanity project ID to both config files

2. **Two separate projects:**
   - Main React app: `/Users/rshao/casevalue.law/` (runs on port 3000)
   - Sanity Studio: `/Users/rshao/casevalue-blog-studio/` (runs on port 3333)

3. **Content is stored in Sanity Cloud** - Your posts are automatically backed up

4. **Real-time updates** - Posts appear on your site within 2 seconds of publishing

5. **Calculator still works** - The calculator is at `/` and functions exactly as before

---

## 📚 Additional Resources

- **Sanity Documentation:** https://www.sanity.io/docs
- **Sanity Studio Guide:** https://www.sanity.io/docs/sanity-studio
- **Rich Text Editor:** https://www.sanity.io/docs/block-content
- **Image Optimization:** https://www.sanity.io/docs/image-url

---

## 🆘 Troubleshooting

### Blog page shows "Failed to load posts"
- Check that you've added your project ID to `sanityClient.js`
- Verify your Sanity project is created and active
- Check browser console for errors

### No posts appearing
- Create at least one post in Sanity Studio
- Make sure the post is **published** (not just saved as draft)
- Refresh the blog page

### Studio won't start
- Make sure you've run `npm install` in the studio directory
- Check that you're in the correct directory: `cd casevalue-blog-studio`
- Verify your project ID is set in `sanity.config.js`

### Navigation doesn't show Blog link
- The dev server should be running
- Clear browser cache and hard refresh
- Check that `Navigation.jsx` was updated correctly

---

## ✨ What's Next?

1. **Complete Step 1-3 above** (create Sanity project and add project ID)
2. **Start the Studio** and create your first blog post
3. **Start publishing** multiple times per week!

Optional enhancements you can add later:
- Comments system (Disqus, Utterances)
- Newsletter integration (Mailchimp, ConvertKit)
- Social sharing buttons
- Related posts by category
- Search functionality
- RSS feed

---

## 📞 Need Help?

If you run into any issues:
1. Check the Sanity Studio README: `/Users/rshao/casevalue-blog-studio/README.md`
2. Visit Sanity documentation: https://www.sanity.io/docs
3. Join Sanity Community Slack: https://slack.sanity.io

---

**Your blog is ready to go! Just add your Sanity project ID and start writing.** 🚀
