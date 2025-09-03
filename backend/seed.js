import "dotenv/config";
import bcrypt from "bcrypt";
import poolPromise from "./config/sql.config.js";
import mongoose from "mongoose";
import { Env } from "./config/env.config.js";

// Import MongoDB models
import Announcement from "./models/announcement.model.js";
import Certificate from "./models/certificate.model.js";
import ChatQnA from "./models/chatQna.model.js";
import Submission from "./models/submission.model.js";

// Connect to databases
async function connectDatabases() {
  try {
    // Connect to SQL Server
    const pool = await poolPromise;
    console.log("✅ Connected to SQL Server");
    
    // Connect to MongoDB
    console.log("⏳ Attempting to connect to MongoDB..."); 
    await mongoose.connect(Env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
    
    return pool;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

// Clear existing data
async function clearData(pool) {
  console.log("🧹 Clearing existing data...");
  
  try {
    // Clear MongoDB collections
    await Announcement.deleteMany({});
    await Certificate.deleteMany({});
    await ChatQnA.deleteMany({});
    await Submission.deleteMany({});
    console.log("✅ MongoDB collections cleared");

    // Clear SQL Server tables (in correct order due to foreign keys)
    const clearQueries = [
      "DELETE FROM team_members",
      "DELETE FROM event_enrollments", 
      "DELETE FROM teams",
      "DELETE FROM events",
      "DELETE FROM users"
    ];

    for (const query of clearQueries) {
      await pool.request().query(query);
    }
    console.log("✅ SQL Server tables cleared");
  } catch (error) {
    console.error("❌ Error clearing data:", error);
  }
}

// Seed Users
async function seedUsers(pool) {
  console.log("👥 Seeding users...");
  
  const users = [
    // Organizers
    { name: "Alice Johnson", email: "alice@example.com", password: await bcrypt.hash("password123", 10), authprovider: "email", role: "organizer" },
    { name: "Bob Smith", email: "bob@example.com", password: await bcrypt.hash("password123", 10), authprovider: "email", role: "organizer" },
    { name: "Carol Williams", email: "carol@example.com", password: await bcrypt.hash("password123", 10), authprovider: "google", role: "organizer" },
    
    // Judges
    { name: "Dr. David Chen", email: "david@example.com", password: await bcrypt.hash("password123", 10), authprovider: "email", role: "judge" },
    { name: "Prof. Emily Davis", email: "emily@example.com", password: await bcrypt.hash("password123", 10), authprovider: "email", role: "judge" },
    { name: "Mark Thompson", email: "mark@example.com", password: await bcrypt.hash("password123", 10), authprovider: "github", role: "judge" },
    
    // Participants
    { name: "John Doe", email: "john@example.com", password: await bcrypt.hash("password123", 10), authprovider: "email", role: "participant" },
    { name: "Jane Smith", email: "jane@example.com", password: await bcrypt.hash("password123", 10), authprovider: "google", role: "participant" },
    { name: "Mike Johnson", email: "mike@example.com", password: await bcrypt.hash("password123", 10), authprovider: "email", role: "participant" },
    { name: "Sarah Wilson", email: "sarah@example.com", password: await bcrypt.hash("password123", 10), authprovider: "github", role: "participant" },
    { name: "Alex Brown", email: "alex@example.com", password: await bcrypt.hash("password123", 10), authprovider: "email", role: "participant" },
    { name: "Emma Davis", email: "emma@example.com", password: await bcrypt.hash("password123", 10), authprovider: "email", role: "participant" },
    { name: "Chris Miller", email: "chris@example.com", password: await bcrypt.hash("password123", 10), authprovider: "google", role: "participant" },
    { name: "Lisa Anderson", email: "lisa@example.com", password: await bcrypt.hash("password123", 10), authprovider: "email", role: "participant" },
    { name: "Ryan Garcia", email: "ryan@example.com", password: await bcrypt.hash("password123", 10), authprovider: "email", role: "participant" },
    { name: "Maya Patel", email: "maya@example.com", password: await bcrypt.hash("password123", 10), authprovider: "github", role: "participant" },
    { name: "Kevin Lee", email: "kevin@example.com", password: await bcrypt.hash("password123", 10), authprovider: "email", role: "participant" },
    { name: "Nicole White", email: "nicole@example.com", password: await bcrypt.hash("password123", 10), authprovider: "email", role: "participant" },
    { name: "Daniel Martinez", email: "daniel@example.com", password: await bcrypt.hash("password123", 10), authprovider: "google", role: "participant" },
    { name: "Jessica Taylor", email: "jessica@example.com", password: await bcrypt.hash("password123", 10), authprovider: "email", role: "participant" }
  ];

  const insertedUsers = [];
  for (const user of users) {
    const query = `
      INSERT INTO users (name, email, password, authprovider, role) 
      OUTPUT INSERTED.userid, INSERTED.name, INSERTED.email, INSERTED.role
      VALUES (@name, @email, @password, @authprovider, @role)
    `;
    
    const result = await pool.request()
      .input('name', user.name)
      .input('email', user.email)
      .input('password', user.password)
      .input('authprovider', user.authprovider)
      .input('role', user.role)
      .query(query);
    
    insertedUsers.push(result.recordset[0]);
  }
  
  console.log(`✅ Created ${insertedUsers.length} users`);
  return insertedUsers;
}

// Seed Events
async function seedEvents(pool, users) {
  console.log("📅 Seeding events...");
  
  const organizers = users.filter(u => u.role === 'organizer');
  
  const events = [
    {
      organizerId: organizers[0].userid,
      name: "AI Innovation Hackathon 2024",
      description: "Build the next generation of AI-powered applications that solve real-world problems.",
      theme: "Artificial Intelligence",
      mode: "Online",
      startDate: new Date('2024-12-01T09:00:00Z'),
      endDate: new Date('2024-12-03T18:00:00Z'),
      submissionDeadline: new Date('2024-12-03T16:00:00Z'),
      resultDate: new Date('2024-12-05T12:00:00Z'),
      rules: "Teams of 2-4 members. Must use at least one AI/ML technology. Original code only.",
      timeline: "Day 1: Team formation and ideation. Day 2: Development. Day 3: Final presentations.",
      tracks: "Web Development, Mobile Apps, Data Science, Computer Vision",
      prizes: "1st Place: $5000, 2nd Place: $3000, 3rd Place: $1500, Best AI Implementation: $1000",
      maxTeamSize: 4,
      sponsors: "TechCorp, AI Solutions Inc, DataMax"
    },
    {
      organizerId: organizers[1].userid,
      name: "Blockchain Revolution Hackathon",
      description: "Create decentralized solutions for tomorrow's challenges using blockchain technology.",
      theme: "Blockchain & Web3",
      mode: "Offline",
      startDate: new Date('2024-11-15T10:00:00Z'),
      endDate: new Date('2024-11-17T17:00:00Z'),
      submissionDeadline: new Date('2024-11-17T15:00:00Z'),
      resultDate: new Date('2024-11-20T14:00:00Z'),
      rules: "Teams of 1-5 members. Must implement blockchain technology. Smart contracts required.",
      timeline: "Day 1: Registration and team formation. Day 2-3: Development and testing.",
      tracks: "DeFi, NFTs, Smart Contracts, dApps",
      prizes: "Winner: $8000, Runner-up: $4000, People's Choice: $2000",
      maxTeamSize: 5,
      sponsors: "CryptoTech, Web3 Foundation, BlockChain Ventures"
    },
    {
      organizerId: organizers[2].userid,
      name: "Green Tech Challenge",
      description: "Develop sustainable technology solutions for environmental conservation and climate action.",
      theme: "Environmental Technology",
      mode: "Online",
      startDate: new Date('2024-10-20T08:00:00Z'),
      endDate: new Date('2024-10-22T19:00:00Z'),
      submissionDeadline: new Date('2024-10-22T17:00:00Z'),
      resultDate: new Date('2024-10-25T16:00:00Z'),
      rules: "Open to all skill levels. Focus on environmental impact. Must include sustainability metrics.",
      timeline: "48-hour continuous hackathon with mentor sessions every 6 hours.",
      tracks: "Clean Energy, Waste Management, Carbon Tracking, Smart Agriculture",
      prizes: "Grand Prize: $6000, Most Innovative: $3000, Best Impact: $2000, Student Special: $1000",
      maxTeamSize: 3,
      sponsors: "GreenTech Solutions, EcoInnovate, Planet Savers Co"
    },
    {
      organizerId: organizers[0].userid,
      name: "Healthcare Innovation Sprint",
      description: "Revolutionize healthcare with cutting-edge technology solutions for better patient outcomes.",
      theme: "Healthcare Technology",
      mode: "Online",
      startDate: new Date('2025-01-10T09:00:00Z'),
      endDate: new Date('2025-01-12T18:00:00Z'),
      submissionDeadline: new Date('2025-01-12T16:30:00Z'),
      resultDate: new Date('2025-01-15T13:00:00Z'),
      rules: "HIPAA compliance required. Teams of 2-6 members. Healthcare professional on team preferred.",
      timeline: "Day 1: Problem identification. Day 2: Solution development. Day 3: Testing and presentation.",
      tracks: "Telemedicine, Medical Devices, Health Analytics, Mental Health",
      prizes: "First: $10000, Second: $5000, Third: $2500, Best UX: $1500",
      maxTeamSize: 6,
      sponsors: "MedTech Corp, HealthInnovate, Digital Health Solutions"
    }
  ];

  const insertedEvents = [];
  for (const event of events) {
    const query = `
      INSERT INTO events (OrganizerID, Name, Description, Theme, Mode, StartDate, EndDate, 
                         SubmissionDeadline, ResultDate, Rules, Timeline, Tracks, Prizes, 
                         MaxTeamSize, Sponsors, IsActive) 
      OUTPUT INSERTED.EventID, INSERTED.Name, INSERTED.OrganizerID
      VALUES (@organizerId, @name, @description, @theme, @mode, @startDate, @endDate, 
              @submissionDeadline, @resultDate, @rules, @timeline, @tracks, @prizes, 
              @maxTeamSize, @sponsors, 1)
    `;
    
    const result = await pool.request()
      .input('organizerId', event.organizerId)
      .input('name', event.name)
      .input('description', event.description)
      .input('theme', event.theme)
      .input('mode', event.mode)
      .input('startDate', event.startDate)
      .input('endDate', event.endDate)
      .input('submissionDeadline', event.submissionDeadline)
      .input('resultDate', event.resultDate)
      .input('rules', event.rules)
      .input('timeline', event.timeline)
      .input('tracks', event.tracks)
      .input('prizes', event.prizes)
      .input('maxTeamSize', event.maxTeamSize)
      .input('sponsors', event.sponsors)
      .query(query);
    
    insertedEvents.push(result.recordset[0]);
  }
  
  console.log(`✅ Created ${insertedEvents.length} events`);
  return insertedEvents;
}

// Seed Teams
async function seedTeams(pool, users, events) {
  console.log("👥 Seeding teams...");
  
  const participants = users.filter(u => u.role === 'participant');
  
  const teams = [
    // AI Hackathon teams
    { teamName: "AI Innovators", eventId: events[0].EventID, createdBy: participants[0].userid },
    { teamName: "Neural Networks", eventId: events[0].EventID, createdBy: participants[3].userid },
    { teamName: "Deep Learning Squad", eventId: events[0].EventID, createdBy: participants[6].userid },
    { teamName: "Machine Minds", eventId: events[0].EventID, createdBy: participants[9].userid },
    
    // Blockchain teams
    { teamName: "Crypto Creators", eventId: events[1].EventID, createdBy: participants[1].userid },
    { teamName: "DeFi Dragons", eventId: events[1].EventID, createdBy: participants[4].userid },
    { teamName: "Smart Contract Specialists", eventId: events[1].EventID, createdBy: participants[7].userid },
    
    // Green Tech teams
    { teamName: "Eco Warriors", eventId: events[2].EventID, createdBy: participants[2].userid },
    { teamName: "Sustainable Solutions", eventId: events[2].EventID, createdBy: participants[5].userid },
    { teamName: "Planet Protectors", eventId: events[2].EventID, createdBy: participants[8].userid },
    
    // Healthcare teams
    { teamName: "Med Tech Pioneers", eventId: events[3].EventID, createdBy: participants[10].userid },
    { teamName: "Health Hackers", eventId: events[3].EventID, createdBy: participants[11].userid }
  ];

  const insertedTeams = [];
  for (const team of teams) {
    const query = `
      INSERT INTO teams (TeamName, EventId, CreatedBy) 
      OUTPUT INSERTED.TeamId, INSERTED.TeamName, INSERTED.EventId, INSERTED.CreatedBy
      VALUES (@teamName, @eventId, @createdBy)
    `;
    
    const result = await pool.request()
      .input('teamName', team.teamName)
      .input('eventId', team.eventId)
      .input('createdBy', team.createdBy)
      .query(query);
    
    insertedTeams.push(result.recordset[0]);
  }
  
  console.log(`✅ Created ${insertedTeams.length} teams`);
  return insertedTeams;
}

// Seed Team Members
async function seedTeamMembers(pool, users, teams) {
  console.log("👤 Seeding team members...");
  
  const participants = users.filter(u => u.role === 'participant');
  
  // Add team leaders as members
  for (const team of teams) {
    const query = `
      INSERT INTO team_members (TeamId, UserId, Role) 
      VALUES (@teamId, @userId, 'Leader')
    `;
    
    await pool.request()
      .input('teamId', team.TeamId)
      .input('userId', team.CreatedBy)
      .query(query);
  }

  // Add additional members to teams
  const memberAssignments = [
    // AI Innovators team
    { teamId: teams[0].TeamId, userId: participants[1].userid, role: 'Member' },
    { teamId: teams[0].TeamId, userId: participants[2].userid, role: 'Member' },
    
    // Neural Networks team  
    { teamId: teams[1].TeamId, userId: participants[4].userid, role: 'Member' },
    { teamId: teams[1].TeamId, userId: participants[5].userid, role: 'Member' },
    { teamId: teams[1].TeamId, userId: participants[12].userid, role: 'Member' },
    
    // Deep Learning Squad
    { teamId: teams[2].TeamId, userId: participants[7].userid, role: 'Member' },
    { teamId: teams[2].TeamId, userId: participants[8].userid, role: 'Member' },
    
    // Machine Minds
    { teamId: teams[3].TeamId, userId: participants[10].userid, role: 'Member' },
    { teamId: teams[3].TeamId, userId: participants[11].userid, role: 'Member' },
    { teamId: teams[3].TeamId, userId: participants[13].userid, role: 'Member' },
    
    // Crypto Creators
    { teamId: teams[4].TeamId, userId: participants[0].userid, role: 'Member' },
    { teamId: teams[4].TeamId, userId: participants[3].userid, role: 'Member' },
    { teamId: teams[4].TeamId, userId: participants[6].userid, role: 'Member' },
    
    // More member assignments...
    { teamId: teams[5].TeamId, userId: participants[9].userid, role: 'Member' },
    { teamId: teams[6].TeamId, userId: participants[12].userid, role: 'Member' },
    { teamId: teams[7].TeamId, userId: participants[13].userid, role: 'Member' },
    { teamId: teams[8].TeamId, userId: participants[0].userid, role: 'Member' },
    { teamId: teams[9].TeamId, userId: participants[1].userid, role: 'Member' },
    { teamId: teams[10].TeamId, userId: participants[2].userid, role: 'Member' },
    { teamId: teams[11].TeamId, userId: participants[3].userid, role: 'Member' }
  ];

  for (const assignment of memberAssignments) {
    const query = `
      INSERT INTO team_members (TeamId, UserId, Role) 
      VALUES (@teamId, @userId, @role)
    `;
    
    await pool.request()
      .input('teamId', assignment.teamId)
      .input('userId', assignment.userId)
      .input('role', assignment.role)
      .query(query);
  }
  
  console.log(`✅ Created team member assignments`);
}

// Seed Event Enrollments
async function seedEnrollments(pool, users, events) {
  console.log("📝 Seeding event enrollments...");
  
  const participants = users.filter(u => u.role === 'participant');
  
  const enrollments = [
    // AI Hackathon enrollments
    ...participants.slice(0, 10).map(p => ({ eventId: events[0].EventID, userId: p.userid })),
    
    // Blockchain enrollments  
    ...participants.slice(0, 8).map(p => ({ eventId: events[1].EventID, userId: p.userid })),
    
    // Green Tech enrollments
    ...participants.slice(2, 12).map(p => ({ eventId: events[2].EventID, userId: p.userid })),
    
    // Healthcare enrollments
    ...participants.slice(5, 14).map(p => ({ eventId: events[3].EventID, userId: p.userid }))
  ];

  for (const enrollment of enrollments) {
    const query = `
      INSERT INTO event_enrollments (EventID, UserID, Status) 
      VALUES (@eventId, @userId, 'Enrolled')
    `;
    
    await pool.request()
      .input('eventId', enrollment.eventId)
      .input('userId', enrollment.userId)
      .query(query);
  }
  
  console.log(`✅ Created ${enrollments.length} event enrollments`);
}

// Seed MongoDB Collections
async function seedMongoDBCollections(users, events, teams) {
  console.log("🍃 Seeding MongoDB collections...");
  
  const organizers = users.filter(u => u.role === 'organizer');
  const participants = users.filter(u => u.role === 'participant');
  const judges = users.filter(u => u.role === 'judge');
  
  // Seed Announcements
  const announcements = [
    {
      eventId: events[0].EventID,
      authorId: organizers[0].userid,
      title: "Welcome to AI Innovation Hackathon!",
      message: "Get ready for 3 days of innovative AI development. Make sure to join our Discord for real-time updates!",
      priority: "high",
      isImportant: true
    },
    {
      eventId: events[0].EventID,  
      authorId: organizers[0].userid,
      title: "Submission Guidelines Updated",
      message: "Please ensure your submissions include a demo video and proper documentation. Check the rules section for details.",
      priority: "medium",
      isImportant: false
    },
    {
      eventId: events[1].EventID,
      authorId: organizers[1].userid,
      title: "Blockchain Resources Available",
      message: "We've compiled a list of helpful blockchain development resources and APIs. Check them out in our resource section.",
      priority: "low",
      isImportant: false
    },
    {
      eventId: events[2].EventID,
      authorId: organizers[2].userid,
      title: "Environmental Impact Metrics",
      message: "Remember to include quantifiable environmental impact metrics in your submissions. This will be a key judging criterion.",
      priority: "high",
      isImportant: true
    }
  ];

  await Announcement.insertMany(announcements);
  
  // Seed Submissions
  const submissions = [
    {
      eventId: events[0].EventID,
      teamId: teams[0].TeamId,
      title: "AI-Powered Smart City Traffic Optimizer",
      description: "An intelligent traffic management system using computer vision and machine learning to optimize traffic flow in real-time, reducing congestion by up to 40%.",
      track: "Computer Vision",
      githubUrl: "https://github.com/ai-innovators/traffic-optimizer",
      videoUrl: "https://youtube.com/watch?v=demo1",
      docs: ["https://docs.google.com/document/d/1", "https://drive.google.com/file/d/1"],
      round: 1,
      judgingStatus: "judged",
      judgeId: judges[0].userid,
      scores: {
        innovation: 8.5,
        technical: 9.0,
        presentation: 7.5,
        impact: 9.2,
        overall: 8.5
      },
      totalScore: 42.7,
      judgeComments: "Excellent implementation with strong real-world impact potential. Great use of ML algorithms.",
      rank: 1,
      isWinner: true,
      prize: "1st Place",
      judgedAt: new Date('2024-12-04T10:00:00Z')
    },
    {
      eventId: events[0].EventID,
      teamId: teams[1].TeamId,
      title: "Medical Diagnosis Assistant AI",
      description: "A deep learning model that assists doctors in diagnosing rare diseases by analyzing medical images and patient symptoms with 95% accuracy.",
      track: "Data Science",
      githubUrl: "https://github.com/neural-networks/med-ai",
      videoUrl: "https://youtube.com/watch?v=demo2",
      docs: ["https://docs.google.com/document/d/2"],
      round: 1,
      judgingStatus: "judged",
      judgeId: judges[1].userid,
      scores: {
        innovation: 9.0,
        technical: 8.8,
        presentation: 8.0,
        impact: 9.5,
        overall: 8.8
      },
      totalScore: 44.1,
      judgeComments: "Outstanding medical application with high accuracy. Could revolutionize healthcare diagnostics.",
      rank: 2,
      isWinner: true,
      prize: "2nd Place",
      judgedAt: new Date('2024-12-04T11:30:00Z')
    },
    {
      eventId: events[1].EventID,
      teamId: teams[4].TeamId,
      title: "Decentralized Supply Chain Tracker",
      description: "A blockchain-based solution for transparent and secure supply chain management, enabling end-to-end product traceability.",
      track: "Smart Contracts",
      githubUrl: "https://github.com/crypto-creators/supply-chain",
      videoUrl: "https://youtube.com/watch?v=demo3",
      docs: ["https://whitepaper.com/supply-chain"],
      round: 1,
      judgingStatus: "in-review",
      judgeId: judges[2].userid,
      scores: {
        innovation: 7.5,
        technical: 8.0,
        presentation: 7.0,
        impact: 8.5,
        overall: 7.8
      }
    },
    {
      eventId: events[2].EventID,
      teamId: teams[7].TeamId,
      title: "Carbon Footprint Blockchain Tracker",
      description: "A decentralized app that tracks and rewards individuals and companies for reducing their carbon footprint using tokenized incentives.",
      track: "Carbon Tracking",
      githubUrl: "https://github.com/eco-warriors/carbon-tracker",
      videoUrl: "https://youtube.com/watch?v=demo4",
      docs: ["https://eco-docs.com/carbon-tracker"],
      round: 1,
      judgingStatus: "pending"
    }
  ];

  await Submission.insertMany(submissions);
  
  // Seed Chat/QnA
  const chatMessages = [
    {
      eventId: events[0].EventID,
      fromUserId: participants[0].userid,
      message: "Can we use pre-trained models like GPT or BERT in our AI solutions?",
      replies: [
        {
          fromUserId: organizers[0].userid,
          message: "Yes, you can use pre-trained models as long as you build something original on top of them. Make sure to mention this in your documentation.",
          createdAt: new Date('2024-11-25T10:15:00Z')
        },
        {
          fromUserId: judges[0].userid,
          message: "Just ensure that your implementation adds significant value beyond the base model capabilities.",
          createdAt: new Date('2024-11-25T10:45:00Z')
        }
      ]
    },
    {
      eventId: events[0].EventID,
      fromUserId: participants[3].userid,
      message: "What are the hardware requirements for testing our computer vision models?",
      replies: [
        {
          fromUserId: organizers[0].userid,
          message: "We recommend at least 8GB RAM and a dedicated GPU if possible. Cloud platforms like Google Colab are also acceptable.",
          createdAt: new Date('2024-11-26T14:20:00Z')
        }
      ]
    },
    {
      eventId: events[1].EventID,
      fromUserId: participants[1].userid,
      message: "Are there any restrictions on which blockchain networks we can build on?",
      replies: [
        {
          fromUserId: organizers[1].userid,
          message: "No restrictions! You can use Ethereum, Polygon, Solana, or any other blockchain network. Choose what works best for your use case.",
          createdAt: new Date('2024-11-10T09:30:00Z')
        }
      ]
    },
    {
      eventId: events[2].EventID,
      fromUserId: participants[2].userid,
      message: "How do we calculate the environmental impact metrics for our solution?",
      replies: []
    }
  ];

  await ChatQnA.insertMany(chatMessages);
  
  // Seed Certificates
  const certificates = [
    {
      eventId: events[0].EventID,
      userId: participants[0].userid,
      certificateUrl: "https://certificates.hackathon.com/ai-innovation-2024/participant-john-doe.pdf"
    },
    {
      eventId: events[0].EventID,
      userId: participants[1].userid, 
      certificateUrl: "https://certificates.hackathon.com/ai-innovation-2024/participant-jane-smith.pdf"
    },
    {
      eventId: events[0].EventID,
      userId: participants[3].userid,
      certificateUrl: "https://certificates.hackathon.com/ai-innovation-2024/winner-mike-johnson.pdf"
    },
    {
      eventId: events[1].EventID,
      userId: participants[1].userid,
      certificateUrl: "https://certificates.hackathon.com/blockchain-revolution-2024/participant-jane-smith.pdf"
    }
  ];

  await Certificate.insertMany(certificates);
  
  console.log("✅ MongoDB collections seeded successfully");
}

// Main seed function
async function seedDatabase() {
  console.log("🌱 Starting database seeding process...\n");
  
  try {
    // Connect to databases
    const pool = await connectDatabases();
    
    // Clear existing data
    await clearData(pool);
    
    // Seed SQL Server data
    console.log("\n📊 Seeding SQL Server...");
    const users = await seedUsers(pool);
    const events = await seedEvents(pool, users);
    const teams = await seedTeams(pool, users, events);
    await seedTeamMembers(pool, users, teams);
    await seedEnrollments(pool, users, events);
    
    // Seed MongoDB data
    console.log("\n🍃 Seeding MongoDB...");
    await seedMongoDBCollections(users, events, teams);
    
    console.log("\n🎉 Database seeding completed successfully!");
    console.log(`
📈 Summary:
- Users: ${users.length}
- Events: ${events.length}
- Teams: ${teams.length}
- Announcements: 4
- Submissions: 4
- Chat Messages: 4
- Certificates: 4
    `);
    
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    // Close connections
    try {
      await mongoose.connection.close();
      console.log("✅ MongoDB connection closed");
    } catch (error) {
      console.log("⚠️ MongoDB connection close error:", error.message);
    }
    
    process.exit(0);
  }
}

// Run the seed if this file is executed directly
  seedDatabase();


export default seedDatabase;