// run: npm run seed
// This file works whether Node is running in CommonJS or ESM mode.

(async () => {
  // Sample events
  const sample = [
    {
      title: 'Intercollege Coding Competition',
      organizer: 'TechSociety',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      type: 'competition',
      description: 'Solve problems and win amazing prizes — t-shirts, mugs, certificates and subscriptions.',
      prizes: ['T-shirt', 'Certificate', '3-month Slack Pro'],
      seats: 150,
      mode: 'online'
    },
    {
      title: '48h Hackathon: Build for Social Good',
      organizer: 'HackClub',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
      type: 'hackathon',
      description: 'Team up for 48 hours, ship an MVP and win internships, premium LinkedIn, and cash prizes.',
      prizes: ['LinkedIn Premium (6 months)', 'Trophy', 'Internship Letters'],
      seats: 60,
      mode: 'hybrid'
    }
  ]

  try {
    // If require is available -> CommonJS environment
    if (typeof require === 'function') {
      require('dotenv').config()
      const mongoose = require('mongoose')
      const Event = require('./models/Event')

      await mongoose.connect(process.env.MONGODB_URI)
      await Event.deleteMany({})
      await Event.insertMany(sample)
      console.log('Seeded (CommonJS)')
      process.exit(0)
    } else {
      // ESM environment
      await import('dotenv/config')
      const mongooseModule = await import('mongoose')
      const mongoose = mongooseModule.default || mongooseModule
      const EventModule = await import('./models/Event.js')
      const Event = EventModule.default || EventModule

      await mongoose.connect(process.env.MONGODB_URI)
      await Event.deleteMany({})
      await Event.insertMany(sample)
      console.log('Seeded (ESM)')
      process.exit(0)
    }
  } catch (err) {
    console.error('Seeding error:', err)
    process.exit(1)
  }
})()
