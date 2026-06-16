import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'blog',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const samplePosts = [
  {
    title: "Getting Started with Web Development",
    slug: "getting-started-web-development",
    content: `
      <h2>Introduction</h2>
      <p>Web development is an exciting field that combines creativity with technical skills. In this guide, we'll explore the fundamentals of web development.</p>
      
      <h2>Key Technologies</h2>
      <ul>
        <li>HTML - Structure</li>
        <li>CSS - Styling</li>
        <li>JavaScript - Interactivity</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>Start by learning HTML basics, then move on to CSS for styling, and finally JavaScript for dynamic functionality.</p>
    `,
    excerpt: "Learn the fundamentals of web development with HTML, CSS, and JavaScript.",
    categoryId: null,
  },
  {
    title: "Best Practices for Modern JavaScript",
    slug: "best-practices-javascript",
    content: `
      <h2>Clean Code</h2>
      <p>Writing clean, maintainable code is essential for long-term project success.</p>
      
      <h2>Performance Tips</h2>
      <ul>
        <li>Minimize bundle size</li>
        <li>Use async/await for asynchronous operations</li>
        <li>Implement proper error handling</li>
      </ul>
      
      <h2>Testing</h2>
      <p>Always write tests for your code to ensure reliability and catch bugs early.</p>
    `,
    excerpt: "Master modern JavaScript best practices for cleaner, faster code.",
    categoryId: null,
  },
  {
    title: "The Future of Web Development",
    slug: "future-web-development",
    content: `
      <h2>Emerging Technologies</h2>
      <p>Web development is constantly evolving with new technologies and frameworks.</p>
      
      <h2>AI and Machine Learning</h2>
      <p>AI is transforming how we build web applications, from automated testing to intelligent user interfaces.</p>
      
      <h2>Web3 and Blockchain</h2>
      <p>Decentralized applications are opening new possibilities for web developers.</p>
    `,
    excerpt: "Explore the latest trends shaping the future of web development.",
    categoryId: null,
  },
  {
    title: "Building Responsive Web Design",
    slug: "responsive-web-design",
    content: `
      <h2>Mobile First Approach</h2>
      <p>Start with mobile design and scale up to larger screens for better user experience.</p>
      
      <h2>CSS Grid and Flexbox</h2>
      <p>Modern CSS layout techniques make it easier to create responsive designs.</p>
      
      <h2>Testing Responsive Design</h2>
      <p>Use browser developer tools and testing frameworks to ensure your design works on all devices.</p>
    `,
    excerpt: "Master responsive design techniques for all device sizes.",
    categoryId: null,
  },
];

async function seedPosts() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🌱 Starting to seed sample blog posts...');
    
    // Get the first admin user
    const [adminUsers] = await connection.execute(
      'SELECT id FROM users WHERE role = ? LIMIT 1',
      ['admin']
    );
    
    if (adminUsers.length === 0) {
      console.error('❌ No admin user found. Please create an admin user first.');
      process.exit(1);
    }
    
    const adminId = adminUsers[0].id;
    console.log(`✅ Found admin user with ID: ${adminId}`);
    
    for (const post of samplePosts) {
      try {
        // Check if post already exists
        const [existing] = await connection.execute(
          'SELECT id FROM posts WHERE slug = ?',
          [post.slug]
        );
        
        if (existing.length > 0) {
          console.log(`⚠️  Post already exists: "${post.title}"`);
          continue;
        }
        
        // Insert the post
        const [result] = await connection.execute(
          `INSERT INTO posts (title, slug, content, excerpt, authorId, categoryId, published, publishedAt, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
          [
            post.title,
            post.slug,
            post.content,
            post.excerpt,
            adminId,
            post.categoryId,
            'published', // published status
          ]
        );
        
        console.log(`✅ Created post: "${post.title}" (ID: ${result.insertId})`);
      } catch (error) {
        console.error(`❌ Error creating post "${post.title}":`, error.message);
      }
    }
    
    console.log('\n✅ Sample posts seeded successfully!');
    console.log('📝 You can now view these posts on the home page and in the admin panel.');
  } catch (error) {
    console.error('❌ Error seeding posts:', error);
    process.exit(1);
  } finally {
    await connection.release();
    await pool.end();
  }
}

seedPosts();
