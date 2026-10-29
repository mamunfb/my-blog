import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

// Sample blog posts in multiple languages
const samplePosts = [
  {
    title: "Getting Started with Web Development",
    slug: "getting-started-web-development",
    content: `
      <h2>Introduction</h2>
      <p>Web development is an exciting field that combines creativity with technical skills. Whether you're interested in frontend, backend, or full-stack development, there's a path for everyone.</p>
      
      <h2>Key Technologies</h2>
      <ul>
        <li><strong>HTML</strong> - The foundation of web pages</li>
        <li><strong>CSS</strong> - Styling and layout</li>
        <li><strong>JavaScript</strong> - Interactivity and functionality</li>
        <li><strong>React</strong> - Modern frontend framework</li>
        <li><strong>Node.js</strong> - Server-side JavaScript</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>Start with HTML and CSS basics, then move on to JavaScript. Practice by building small projects and gradually increase complexity.</p>
      
      <h2>Resources</h2>
      <p>There are many free resources available online including tutorials, documentation, and communities ready to help you learn.</p>
    `,
    excerpt: "Learn the fundamentals of web development and start your coding journey today.",
    featured: true,
  },
  {
    title: "The Future of Artificial Intelligence",
    slug: "future-artificial-intelligence",
    content: `
      <h2>AI Revolution</h2>
      <p>Artificial Intelligence is transforming every aspect of our lives, from healthcare to transportation. The pace of innovation is accelerating rapidly.</p>
      
      <h2>Current Applications</h2>
      <ul>
        <li>Natural Language Processing</li>
        <li>Computer Vision</li>
        <li>Autonomous Vehicles</li>
        <li>Medical Diagnosis</li>
        <li>Predictive Analytics</li>
      </ul>
      
      <h2>Future Possibilities</h2>
      <p>As AI continues to evolve, we can expect breakthroughs in areas like quantum computing, robotics, and general artificial intelligence.</p>
      
      <h2>Challenges Ahead</h2>
      <p>While AI offers tremendous potential, we must address ethical concerns, bias, and ensure responsible development.</p>
    `,
    excerpt: "Explore the transformative impact of AI and what the future holds.",
    featured: true,
  },
  {
    title: "Sustainable Living in the Modern World",
    slug: "sustainable-living-modern-world",
    content: `
      <h2>Why Sustainability Matters</h2>
      <p>Climate change and environmental degradation are pressing issues. Sustainable living helps reduce our carbon footprint and protect the planet for future generations.</p>
      
      <h2>Simple Changes You Can Make</h2>
      <ul>
        <li>Reduce plastic consumption</li>
        <li>Use renewable energy</li>
        <li>Support local businesses</li>
        <li>Grow your own food</li>
        <li>Use public transportation</li>
      </ul>
      
      <h2>Impact of Individual Actions</h2>
      <p>While individual efforts may seem small, when multiplied across millions of people, they create significant positive change.</p>
      
      <h2>Building a Sustainable Future</h2>
      <p>Sustainability is not just an environmental issue—it's about creating a better quality of life for everyone.</p>
    `,
    excerpt: "Discover practical ways to live sustainably and make a positive impact on our planet.",
    featured: false,
  },
  {
    title: "Digital Marketing Strategies for 2024",
    slug: "digital-marketing-strategies-2024",
    content: `
      <h2>The Digital Marketing Landscape</h2>
      <p>Digital marketing continues to evolve with new technologies and platforms emerging constantly. Success requires staying updated and adapting strategies.</p>
      
      <h2>Key Strategies for 2024</h2>
      <ul>
        <li><strong>AI-Powered Personalization</strong> - Tailor content to individual users</li>
        <li><strong>Video Marketing</strong> - Engage audiences with compelling video content</li>
        <li><strong>Social Commerce</strong> - Sell directly through social platforms</li>
        <li><strong>Voice Search Optimization</strong> - Optimize for voice queries</li>
        <li><strong>Community Building</strong> - Create loyal communities around your brand</li>
      </ul>
      
      <h2>Measuring Success</h2>
      <p>Use data analytics to track performance and make informed decisions about your marketing efforts.</p>
      
      <h2>Looking Ahead</h2>
      <p>The future of marketing is about building genuine connections with your audience through authentic, valuable content.</p>
    `,
    excerpt: "Master the latest digital marketing strategies to grow your business in 2024.",
    featured: true,
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting to seed blog posts...");

    const { rows: users } = await pool.query(
      "SELECT id FROM users WHERE role = 'admin' LIMIT 1",
    );
    if (!users.length) {
      console.error("❌ No admin user found. Please create an admin user first.");
      process.exitCode = 1;
      return;
    }

    const authorId = users[0].id;
    console.log(`📝 Using author ID: ${authorId}`);

    for (const post of samplePosts) {
      console.log(`📝 Creating post: ${post.title}`);
      const { rows } = await pool.query(
        'INSERT INTO posts (title, slug, content, excerpt, "authorId", published, "publishedAt", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING id',
        [post.title, post.slug, post.content, post.excerpt, authorId, "published", new Date()],
      );
      console.log(`✅ Post created: ${post.title} (ID: ${rows[0].id})`);
    }

    console.log("✨ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedDatabase();
