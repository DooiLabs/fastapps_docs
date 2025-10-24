#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 설정
const BASE_URL = 'https://www.fastapps.org';
const SITEMAP_PATH = './public/sitemap.xml';
const DOCS_JSON_PATH = './docs.json';
const BLOG_DIR = './blog';
const README_BLOG_PATH = './README_BLOG.md';

// 현재 날짜를 ISO 형식으로 생성
function getCurrentDate() {
  return new Date().toISOString();
}

// docs.json에서 페이지 경로 추출
function extractPagesFromDocs(docsConfig) {
  const pages = new Set();
  
  // 홈페이지 추가
  pages.add('/');
  
  // 각 탭의 그룹에서 페이지 추출
  docsConfig.navigation.tabs.forEach(tab => {
    tab.groups.forEach(group => {
      group.pages.forEach(page => {
        // /index 경로는 제외하고 일반 경로만 추가
        const cleanPath = page.replace('/index', '');
        pages.add(`/${cleanPath}`);
      });
    });
  });
  
  return Array.from(pages);
}

// 블로그 폴더에서 .mdx 파일 스캔하고 메타데이터 추출
function scanBlogPosts() {
  const blogPosts = [];
  
  try {
    const files = fs.readdirSync(BLOG_DIR);
    
    files.forEach(file => {
      if (file.endsWith('.mdx') && file !== 'index.mdx') {
        const slug = file.replace('.mdx', '');
        const filePath = path.join(BLOG_DIR, file);
        
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const metadata = extractMetadata(content);
          
          blogPosts.push({
            slug: slug,
            url: `/blog/${slug}`,
            title: metadata.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: metadata.description || '',
            date: metadata.publishDate || metadata.date || new Date().toISOString().split('T')[0],
            author: metadata.author || 'FastApps Team',
            tags: metadata.tags || [],
            image: metadata.image || '/images/default-blog.png'
          });
        } catch (error) {
          console.warn(`블로그 포스트 메타데이터를 읽을 수 없습니다: ${file}`, error.message);
          // 메타데이터가 없어도 기본 정보로 추가
          blogPosts.push({
            slug: slug,
            url: `/blog/${slug}`,
            title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: '',
            date: new Date().toISOString().split('T')[0],
            author: 'FastApps Team',
            tags: [],
            image: '/images/default-blog.png'
          });
        }
      }
    });
  } catch (error) {
    console.warn('블로그 폴더를 읽을 수 없습니다:', error.message);
  }
  
  return blogPosts;
}

// MDX 파일에서 메타데이터 추출
function extractMetadata(content) {
  const metadata = {};
  
  // frontmatter 추출 (---로 둘러싸인 부분)
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    const lines = frontmatter.split('\n');
    
    lines.forEach(line => {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        const key = match[1];
        let value = match[2].trim();
        
        // 따옴표 제거
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        // 배열 처리
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(item => 
            item.trim().replace(/^["']|["']$/g, '')
          );
        }
        
        metadata[key] = value;
      }
    });
  }
  
  return metadata;
}

// 우선순위 결정
function getPriority(url) {
  if (url === '/') return '1.00';
  if (url.startsWith('/blog/') && url !== '/blog') return '0.64';
  if (url === '/blog') return '0.80';
  return '0.80';
}

// XML sitemap 생성
function generateSitemap(pages) {
  const currentDate = getCurrentDate();
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<!-- Auto-generated sitemap - Generated on ${currentDate} -->


`;

  // 페이지들을 정렬 (홈페이지가 맨 위에 오도록)
  const sortedPages = pages.sort((a, b) => {
    if (a === '/') return -1;
    if (b === '/') return 1;
    return a.localeCompare(b);
  });

  sortedPages.forEach(page => {
    const priority = getPriority(page);
    sitemap += `<url>
  <loc>${BASE_URL}${page}</loc>
  <lastmod>${currentDate}</lastmod>
  <priority>${priority}</priority>
</url>
`;
  });

  sitemap += `


</urlset>`;

  return sitemap;
}

// README_BLOG.md 업데이트
function updateReadmeBlog(blogPosts) {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // 날짜별로 정렬 (최신순)
  const sortedPosts = blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  let readmeContent = `# 📝 FastApps Blog Writing Guide

This guide explains the rules and formats to follow when writing new posts for the FastApps blog. All blog posts must follow this guide to maintain consistency and quality.

## 🎯 Purpose

- **Maintain Consistency**: Unified style and structure for all blog posts
- **SEO Optimization**: Search engine-friendly content creation
- **User Experience**: Optimized reading experience for readers
- **Maintainability**: Efficiency in future blog management

## 📁 File Structure

\`\`\`
fastapps_docs/
├── blog/
│   ├── index.mdx                    # Blog main page
│   ├── new-feature-launch.mdx       # Example: New feature launch
│   ├── widget-system-update.mdx     # Example: Widget system update
│   └── authentication-security-update.mdx  # Example: Security update
├── docs.json                        # Navigation configuration
└── styles.css                       # Blog styling
\`\`\`

## 📝 How to Write a New Blog Post

### 1. File Naming Rules

**Format**: \`blog/[kebab-case-title].mdx\`

**IMPORTANT**: Always use the blog post title converted to kebab-case for the filename. This ensures the URL matches the title exactly.

**Examples**:
- ✅ \`inside-the-chatgpt-apps-sdk-how-it-actually-works.mdx\` (matches title exactly)
- ✅ \`what-are-apps-in-chatgpt-and-why-they-are-the-future-of-software.mdx\` (matches title exactly)
- ✅ \`new-feature-launch.mdx\`
- ✅ \`widget-system-update.mdx\`
- ❌ \`New Feature Launch.mdx\` (uppercase, spaces)
- ❌ \`new_feature_launch.mdx\` (underscores)
- ❌ \`chatgpt-apps-sdk-inside.mdx\` (doesn't match title)

### 2. Metadata (Frontmatter)

All blog posts must include the following metadata:

\`\`\`mdx
---
title: "Post Title (within 60 characters)"
description: "Post description (within 160 characters, SEO optimized)"
date: "YYYY-MM-DD"
tags: ["tag1", "tag2", "tag3", "tag4", "tag5"]
slug: "kebab-case-title"
author: "FastApps Team"
image: "/images/your-image.png"
canonical: "https://www.fastapps.org/blog/your-slug"
---
\`\`\`

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
\`\`\`mdx
---
[metadata]
---

[Main content - start directly without title]

## 🎯 Main Section

### Subsection

#### Detailed Content

---

*Closing statement*
\`\`\`

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
\`\`\`javascript
// JavaScript example
const example = "Code examples use syntax highlighting";
\`\`\`

\`\`\`python
# Python example
def example_function():
    return "Python code is also supported"
\`\`\`

### 5. Image Usage

#### Image Location
- **Path**: Use \`/images/\` directory
- **Format**: PNG, JPG, SVG supported
- **Size**: 1200x630 (social media optimized)

#### Image Reference
\`\`\`mdx
![Image description](/images/your-image.png)
\`\`\`

### 6. Link Usage

#### Internal Links
- **Use absolute paths**: \`/blog/other-post\`
- **Avoid relative paths**: \`./other-post\`

#### External Links
- **Open in new tab**: \`[text](https://example.com){:target="_blank"}\`

## 🔧 Technical Configuration

### 1. docs.json Update

After adding a new blog post, you must update the \`docs.json\` file. **ALWAYS add new posts to the end of the pages array**:

\`\`\`json
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
\`\`\`

**IMPORTANT**: 
- Use the exact filename (without .mdx extension) in the pages array
- Always add new posts to the end of the list
- This automatically makes them appear in "All posts" section

### 2. Blog Index Update

Add the new post to \`blog/index.mdx\`:

\`\`\`mdx
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
\`\`\`

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
- [ ] Has the new post been added to \`docs.json\` **at the end of the pages array**?
- [ ] Does the filename in docs.json match the actual filename (without .mdx)?
- [ ] Has the new post been added to \`blog/index.mdx\`?
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

*Auto-generated list of current blog posts (${currentDate})*

`;

  // 현재 블로그 포스트 목록 추가
  if (sortedPosts.length > 0) {
    readmeContent += `\n### 📝 Published Posts (${sortedPosts.length} posts)\n\n`;
    
    sortedPosts.forEach((post, index) => {
      const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      readmeContent += `${index + 1}. **${post.title}**\n`;
      readmeContent += `   - **URL**: \`${post.url}\`\n`;
      readmeContent += `   - **Date**: ${formattedDate}\n`;
      readmeContent += `   - **Author**: ${post.author}\n`;
      if (post.tags && post.tags.length > 0) {
        readmeContent += `   - **Tags**: ${post.tags.join(', ')}\n`;
      }
      if (post.description) {
        readmeContent += `   - **Description**: ${post.description}\n`;
      }
      readmeContent += `\n`;
    });
  } else {
    readmeContent += `\n### 📝 Published Posts\n\n*No blog posts found.*\n\n`;
  }

  readmeContent += `\n---\n\n*This guide is continuously updated to maintain the quality and consistency of the FastApps blog. Last updated: ${currentDate}*`;

  return readmeContent;
}

// 메인 실행 함수
function main() {
  try {
    console.log('🚀 Sitemap 및 README_BLOG.md 생성 시작...');
    
    // docs.json 읽기
    if (!fs.existsSync(DOCS_JSON_PATH)) {
      throw new Error(`docs.json 파일을 찾을 수 없습니다: ${DOCS_JSON_PATH}`);
    }
    
    const docsConfig = JSON.parse(fs.readFileSync(DOCS_JSON_PATH, 'utf8'));
    console.log('📖 docs.json 파일 읽기 완료');
    
    // 페이지 추출
    const docPages = extractPagesFromDocs(docsConfig);
    console.log(`📄 문서 페이지 ${docPages.length}개 발견`);
    
    // 블로그 포스트 스캔 (메타데이터 포함)
    const blogPosts = scanBlogPosts();
    console.log(`📝 블로그 포스트 ${blogPosts.length}개 발견`);
    
    // sitemap용 페이지 URL 추출
    const blogPageUrls = blogPosts.map(post => post.url);
    const allPages = [...docPages, ...blogPageUrls];
    
    // 중복 제거
    const uniquePages = [...new Set(allPages)];
    console.log(`🔗 총 ${uniquePages.length}개 페이지`);
    
    // sitemap 생성
    const sitemapContent = generateSitemap(uniquePages);
    
    // public 폴더가 없으면 생성
    const publicDir = path.dirname(SITEMAP_PATH);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
      console.log('📁 public 폴더 생성');
    }
    
    // sitemap.xml 파일 쓰기
    fs.writeFileSync(SITEMAP_PATH, sitemapContent, 'utf8');
    console.log(`✅ Sitemap 생성 완료: ${SITEMAP_PATH}`);
    
    // README_BLOG.md 업데이트
    const readmeContent = updateReadmeBlog(blogPosts);
    fs.writeFileSync(README_BLOG_PATH, readmeContent, 'utf8');
    console.log(`✅ README_BLOG.md 업데이트 완료: ${README_BLOG_PATH}`);
    
    // 생성된 페이지 목록 출력
    console.log('\n📋 생성된 페이지 목록:');
    uniquePages.forEach(page => {
      console.log(`  - ${BASE_URL}${page}`);
    });
    
    // 블로그 포스트 목록 출력
    if (blogPosts.length > 0) {
      console.log('\n📝 블로그 포스트 목록:');
      blogPosts.forEach((post, index) => {
        console.log(`  ${index + 1}. ${post.title} (${post.date})`);
      });
    }
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

// 스크립트가 직접 실행될 때만 main 함수 호출
if (require.main === module) {
  main();
}

module.exports = { main, extractPagesFromDocs, scanBlogPosts, generateSitemap, updateReadmeBlog };
