# 📝 FastApps Blog Writing Guide

This guide explains the rules and formats to follow when writing new posts for the FastApps blog. All blog posts must follow this guide to maintain consistency and quality.

## 🎯 Purpose

- **Maintain Consistency**: Unified style and structure for all blog posts
- **SEO Optimization**: Search engine-friendly content creation
- **User Experience**: Optimized reading experience for readers
- **Maintainability**: Efficiency in future blog management

## 📁 File Structure

```
fastapps_docs/
├── blog/
│   ├── index.mdx                    # Blog main page
│   ├── new-feature-launch.mdx       # Example: New feature launch
│   ├── widget-system-update.mdx     # Example: Widget system update
│   └── authentication-security-update.mdx  # Example: Security update
├── docs.json                        # Navigation configuration
└── styles.css                       # Blog styling
```

## 📝 How to Write a New Blog Post

### 1. File Naming Rules

**Format**: `blog/[kebab-case-title].mdx`

**IMPORTANT**: Always use the blog post title converted to kebab-case for the filename. This ensures the URL matches the title exactly.

**Examples**:
- ✅ `inside-the-chatgpt-apps-sdk-how-it-actually-works.mdx` (matches title exactly)
- ✅ `what-are-apps-in-chatgpt-and-why-they-are-the-future-of-software.mdx` (matches title exactly)
- ✅ `new-feature-launch.mdx`
- ✅ `widget-system-update.mdx`
- ❌ `New Feature Launch.mdx` (uppercase, spaces)
- ❌ `new_feature_launch.mdx` (underscores)
- ❌ `chatgpt-apps-sdk-inside.mdx` (doesn't match title)

### 2. Metadata (Frontmatter)

All blog posts must include the following metadata:

```mdx
---
title: "Post Title (within 60 characters)"
description: "Post description (within 160 characters, SEO optimized)"
date: "YYYY-MM-DD"
tags: ["tag1", "tag2", "tag3", "tag4", "tag5"]
slug: "kebab-case-title"
author: "FastApps Team"
image: "/images/your-image.png"
canonical: "https://docs.fastapps.org/blog/your-slug"
---
```

#### Metadata Field Descriptions

- **title**: Post title (displayed in search results)
- **description**: Post summary (displayed when shared on social media)
- **date**: Publication date (YYYY-MM-DD format)
- **tags**: Related tags (5 or fewer, lowercase, use hyphens)
- **slug**: Unique identifier used in URL
- **author**: Author (default: "FastApps Team")
- **image**: Image for social media sharing
- **canonical**: Canonical URL (prevents duplicate content)

### 3. Content Structure

#### Basic Structure
```mdx
---
[metadata]
---

[Main content - start directly without title]

## 🎯 Main Section

### Subsection

#### Detailed Content

---

*Closing statement*
```

#### Heading Rules
- **No H1 usage**: Mintlify automatically generates titles
- **H2 (##)**: Main sections
- **H3 (###)**: Subsections
- **H4 (####)**: Detailed content

#### Emoji Usage
- Recommended to use relevant emojis in section titles
- Examples: 🎉, 🚀, 🔧, 📊, 🎯, ❓

### 4. Content Writing Guidelines

#### Language
- **Write in English**: All blog posts must be written in English
- **Consistent Tone**: Maintain a professional yet friendly tone

#### Length
- **Minimum 800 words**: Provide sufficient information
- **Maximum 2500 words**: Maintain readable length

#### Structure
1. **Introduction**: Introduce the purpose and main content of the post
2. **Main Body**: Organize main content by sections
3. **Code Examples**: Include actual code when possible
4. **Conclusion**: Summary and next steps

#### Code Blocks
```javascript
// JavaScript example
const example = "Code examples use syntax highlighting";
```

```python
# Python example
def example_function():
    return "Python code is also supported"
```

### 5. Image Usage

#### Image Location
- **Path**: Use `/images/` directory
- **Format**: PNG, JPG, SVG supported
- **Size**: 1200x630 (social media optimized)

#### Image Reference
```mdx
![Image description](/images/your-image.png)
```

### 6. Link Usage

#### Internal Links
- **Use absolute paths**: `/blog/other-post`
- **Avoid relative paths**: `./other-post`

#### External Links
- **Open in new tab**: `[text](https://example.com){:target="_blank"}`

## 🔧 Technical Configuration

### 1. docs.json Update

After adding a new blog post, you must update the `docs.json` file. **ALWAYS add new posts to the end of the pages array**:

```json
{
  "tab": "Blog",
  "groups": [
    {
      "group": "Blog",
      "pages": [
        "blog/index",
        "blog/what-are-apps-in-chatgpt-and-why-they-are-the-future-of-software",
        "blog/inside-the-chatgpt-apps-sdk-how-it-actually-works",
        "blog/your-new-post"
      ]
    }
  ]
}
```

**IMPORTANT**: 
- Use the exact filename (without .mdx extension) in the pages array
- Always add new posts to the end of the list
- This automatically makes them appear in "All posts" section

### 2. Blog Index Update

Add the new post to `blog/index.mdx`:

```mdx
<div className="blog-post-card">
  <div className="blog-post-content">
    <div className="blog-post-meta">
      <div className="blog-tags">
        <span className="blog-tag">Category</span>
        <span className="blog-tag">Type</span>
      </div>
    </div>
    <h2 className="blog-post-title">
      <a href="/blog/your-new-post">Your Post Title</a>
    </h2>
    <p className="blog-post-summary">
      Your post description here...
    </p>
    <div className="blog-post-author">
      <span className="author-name">FastApps Team</span>
      <span className="separator">•</span>
      <span className="publish-date">DD MMM YYYY</span>
    </div>
    <div className="blog-post-cta">
      <a href="/blog/your-new-post" className="read-more-link">
        <span>Read more</span>
        <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14m-7-7 7 7-7 7"/>
        </svg>
      </a>
    </div>
  </div>
  <div className="blog-post-image">
    <a href="/blog/your-new-post">
      <div className="image-container">
        <img src="/images/your-image.png" alt="Your Post Title" />
      </div>
    </a>
  </div>
</div>
```

## 📋 Checklist

Before publishing a new blog post, check the following items:

### Content
- [ ] Is the title within 60 characters?
- [ ] Is the description within 160 characters?
- [ ] Are all metadata fields correctly set?
- [ ] Is the filename in kebab-case format **AND matches the title exactly**?
- [ ] Is it written in English?
- [ ] Is it an appropriate length (800-2500 words)?

### Technical
- [ ] Has the new post been added to `docs.json` **at the end of the pages array**?
- [ ] Does the filename in docs.json match the actual filename (without .mdx)?
- [ ] Has the new post been added to `blog/index.mdx`?
- [ ] Are images in the correct path?
- [ ] Are links set to absolute paths?

### SEO
- [ ] Are related tags set to 5 or fewer?
- [ ] Is the canonical URL set?
- [ ] Is the image alt text set?
- [ ] Is the heading structure correct?

## 🎨 Style Guide

### Colors
- **Primary**: #4A90E2 (Brand Blue)
- **Light**: #6FB1FF
- **Dark**: #2563EB

### Typography
- **Headings**: Bold text, hierarchical structure
- **Body**: Readable line spacing (1.6)
- **Code**: Monospace font usage

### Layout
- **Desktop**: 2-column grid (text | image)
- **Mobile**: 1-column vertical layout
- **Responsive**: Optimized for all devices

## 🚀 Deployment Process

1. **Local Testing**: Test locally with Mintlify CLI
2. **Review**: Content and technical review
3. **Deploy**: Git commit and push
4. **Verification**: Check on the actual site after deployment

## 📞 Support

If you encounter issues while writing a blog post:
- **Technical Issues**: Contact the development team
- **Content Related**: Contact the marketing team
- **Design Related**: Contact the design team

---

## 📚 Current Blog Posts

*Auto-generated list of current blog posts (November 4, 2025)*


### 📝 Published Posts (2 posts)

1. **Inside the ChatGPT Apps SDK: How It Actually Works**
   - **URL**: `/blog/inside-the-chatgpt-apps-sdk-how-it-actually-works`
   - **Date**: Oct 23, 2025
   - **Author**: Zach Park, Co-founder of Dooilabs
   - **Tags**: Apps SDK, MCP, Technical Deep Dive
   - **Description**: Dive deep into the technical architecture of the OpenAI Apps SDK, exploring MCP servers, widgets, and the window.openai bridge that powers ChatGPT apps.

2. **What Are Apps in ChatGPT and Why They're the Future of Software**
   - **URL**: `/blog/what-are-apps-in-chatgpt-and-why-they-are-the-future-of-software`
   - **Date**: Oct 22, 2025
   - **Author**: Zach Park, Co-founder of Dooilabs
   - **Tags**: Apps in ChatGPT
   - **Description**: Learn what Apps in ChatGPT are and how OpenAI's Apps SDK powers a new generation of conversational, AI-driven software.


---

*This guide is continuously updated to maintain the quality and consistency of the FastApps blog. Last updated: November 4, 2025*