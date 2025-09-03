'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Users, Target, Lightbulb, Heart, Award, Globe, Code, Zap } from 'lucide-react'

export default function AboutPage() {
  const features = [
    {
      icon: Users,
      title: "Expert Team",
      description: "Passionate innovators with 10+ years experience",
      detail: "50+ professionals"
    },
    {
      icon: Target,
      title: "Mission Driven",
      description: "Transforming ideas into digital excellence",
      detail: "100% commitment"
    },
    {
      icon: Lightbulb,
      title: "Innovation First",
      description: "Cutting-edge solutions for tomorrow's challenges",
      detail: "AI-powered"
    },
    {
      icon: Heart,
      title: "Client Success",
      description: "Your success is our primary focus",
      detail: "99% satisfaction"
    }
  ]

  const teamMembers = [
    {
      name: "Megha Lousi",
      role: "CEO & Founder",
      experience: "15+ years",
      specialty: "Strategic Leadership",
      skills: ["Vision", "Growth", "Innovation"]
    },
    {
      name: "Arjun Mehta",
      role: "CTO",
      experience: "12+ years", 
      specialty: "Technical Architecture",
      skills: ["AI/ML", "Cloud", "Security"]
    },
    {
      name: "Kalyan Reddy",
      role: "Head of Design",
      experience: "10+ years",
      specialty: "User Experience",
      skills: ["UI/UX", "Research", "Strategy"]
    },
    {
      name: "Sita Sharma",
      role: "Lead Developer",
      experience: "8+ years",
      specialty: "Full Stack Development", 
      skills: ["React", "Node.js", "DevOps"]
    }
  ]

  const achievements = [
    {
      icon: Award,
      metric: "200+",
      label: "Projects Delivered",
      description: "Successfully completed projects across industries"
    },
    {
      icon: Globe,
      metric: "25+",
      label: "Countries Served",
      description: "Global reach with local expertise"
    },
    {
      icon: Code,
      metric: "1M+",
      label: "Lines of Code",
      description: "Clean, scalable, and maintainable solutions"
    },
    {
      icon: Zap,
      metric: "99.9%",
      label: "Uptime Rate",
      description: "Reliable and robust infrastructure"
    }
  ]

  const values = [
    {
      title: "Innovation",
      description: "We embrace cutting-edge technologies and creative thinking to solve complex challenges.",
      highlight: "Future-focused"
    },
    {
      title: "Excellence", 
      description: "We pursue perfection in every detail, delivering solutions that exceed expectations.",
      highlight: "Quality-driven"
    },
    {
      title: "Collaboration",
      description: "We believe great things happen when brilliant minds work together towards a common goal.",
      highlight: "Team-oriented"
    },
    {
      title: "Integrity",
      description: "We build trust through transparency, honesty, and ethical business practices.",
      highlight: "Trust-based"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <div className="fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              About Our Company
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              We're a passionate team of innovators, designers, and developers dedicated to 
              transforming ideas into extraordinary digital experiences that drive real business impact.
            </p>
            <Button size="lg" className="hover-lift group bg-primary hover:bg-primary/90 text-primary-foreground">
              Our Story
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className={`card-optimized hover-lift border glass-effect transition-smooth ${
                  index % 2 === 0 ? 'slide-in-left' : 'slide-in-right'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center h-full flex flex-col">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">{feature.description}</p>
                  <div className="text-primary font-medium text-sm">
                    {feature.detail}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Mission */}
            <div className="slide-in-left">
              <Card className="card-optimized border glass-effect">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Our Mission</h2>
                  <p className="text-muted-foreground mb-6">
                    To empower businesses with innovative digital solutions that not only meet today's 
                    challenges but anticipate tomorrow's opportunities. We bridge the gap between 
                    cutting-edge technology and human-centered design.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-foreground text-sm">Innovation-first approach</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-foreground text-sm">Sustainable digital transformation</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-foreground text-sm">Measurable business impact</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Overview */}
            <div className="slide-in-right space-y-6">
              <Card className="card-optimized border glass-effect">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Meet Our Leadership</h3>
                  <div className="space-y-4">
                    {teamMembers.slice(0, 2).map((member) => (
                      <div key={member.name} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-semibold text-foreground">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                          <p className="text-xs text-primary">{member.experience} experience</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-optimized border glass-effect">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Why Choose Us</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div key={achievement.label} className="text-center p-4 rounded-lg bg-muted/50">
                        <achievement.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold text-foreground">{achievement.metric}</div>
                        <div className="text-xs text-muted-foreground">{achievement.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Expert Team</h2>
            <p className="text-lg text-muted-foreground">
              The brilliant minds behind our innovative solutions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card 
                key={member.name}
                className={`card-optimized hover-lift border glass-effect transition-smooth fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground mb-4">{member.specialty}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs bg-muted/50">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid gap-6">
            {values.map((value, index) => (
              <Card 
                key={value.title}
                className={`card-optimized hover-lift border glass-effect fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        {value.highlight}
                      </Badge>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="card-optimized border glass-effect overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="fade-in">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Let's collaborate to bring your vision to life. Our team is ready to tackle 
                  your next big challenge and create something extraordinary together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="hover-lift group bg-primary hover:bg-primary/90 text-primary-foreground">
                    Get In Touch
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button size="lg" variant="outline" className="hover-lift border-border hover:bg-muted">
                    View Our Work
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}