import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Users, Trophy, Calendar } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
        <div className="absolute inset-0 bg-card/20 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Get In Touch with us<span className="bg-gradient-primary bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Have questions about our hackathon? Need support with your submission? 
              We're here to help you succeed in your innovation journey.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* General Inquiries */}
          <div className="group card-optimized bg-card hover:bg-accent/5 border border-border p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover-lift glass-effect">
            <div className="bg-gradient-secondary/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-gradient-secondary/20 transition-colors">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">General Inquiries</h3>
            <p className="text-sm text-muted-foreground mb-4">Questions about the hackathon</p>
            <p className="text-sm font-medium text-primary">info@hackathon.com</p>
          </div>

          {/* Technical Support */}
          <div className="group card-optimized bg-card hover:bg-accent/5 border border-border p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover-lift glass-effect">
            <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-primary/20 transition-colors">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Technical Support</h3>
            <p className="text-sm text-muted-foreground mb-4">Platform & submission help</p>
            <p className="text-sm font-medium text-primary">+1 (555) 123-4567</p>
          </div>

          {/* Mentorship */}
          <div className="group card-optimized bg-card hover:bg-accent/5 border border-border p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover-lift glass-effect">
            <div className="bg-gradient-accent/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-gradient-accent/20 transition-colors">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Mentorship</h3>
            <p className="text-sm text-muted-foreground mb-4">Connect with industry experts</p>
            <p className="text-sm font-medium text-primary">mentors@hackathon.com</p>
          </div>

          {/* Partnerships */}
          <div className="group card-optimized bg-card hover:bg-accent/5 border border-border p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover-lift glass-effect">
            <div className="bg-chart-2/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-chart-2/20 transition-colors">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Partnerships</h3>
            <p className="text-sm text-muted-foreground mb-4">Sponsor & partner with us</p>
            <p className="text-sm font-medium text-primary">partners@hackathon.com</p>
          </div>
        </div>

        {/* Contact Form & Info Section */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card border border-border p-8 rounded-lg shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder-muted-foreground transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder-muted-foreground transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder-muted-foreground transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                <select className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-foreground transition-colors">
                  <option>General Question</option>
                  <option>Technical Support</option>
                  <option>Mentorship Request</option>
                  <option>Partnership Inquiry</option>
                  <option>Media & Press</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                <textarea 
                  rows={5}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder-muted-foreground resize-none transition-colors"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover-scale shadow-lg hover:shadow-xl"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Office Info */}
            <div className="bg-card border border-border p-6 rounded-lg shadow-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center text-foreground">
                <div className="bg-primary/10 p-2 rounded-lg mr-3">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                Our Office
              </h3>
              <p className="text-muted-foreground mb-2">123 Innovation Drive</p>
              <p className="text-muted-foreground mb-2">Tech Valley, CA 94043</p>
              <p className="text-muted-foreground">United States</p>
            </div>

            {/* Hours */}
            <div className="bg-card border border-border p-6 rounded-lg shadow-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center text-foreground">
                <div className="bg-secondary/10 p-2 rounded-lg mr-3">
                  <Clock className="w-5 h-5 text-secondary" />
                </div>
                Support Hours
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="text-foreground font-medium">9:00 AM - 6:00 PM PST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-foreground font-medium">10:00 AM - 4:00 PM PST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-muted-foreground">Closed</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-card border border-border p-6 rounded-lg shadow-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center text-foreground">
                <div className="bg-accent/20 p-2 rounded-lg mr-3">
                  <Calendar className="w-5 h-5 text-accent-foreground" />
                </div>
                Quick Links
              </h3>
              <div className="space-y-3">
                <a href="#" className="block text-primary hover:text-primary/80 transition-colors duration-200 hover:underline">
                  Hackathon Schedule →
                </a>
                <a href="#" className="block text-primary hover:text-primary/80 transition-colors duration-200 hover:underline">
                  Registration Guide →
                </a>
                <a href="#" className="block text-primary hover:text-primary/80 transition-colors duration-200 hover:underline">
                  Submission Guidelines →
                </a>
                <a href="#" className="block text-primary hover:text-primary/80 transition-colors duration-200 hover:underline">
                  FAQ →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card border border-border p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover-lift backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-3 text-primary">When is the hackathon?</h3>
              <p className="text-muted-foreground">The hackathon runs from March 15-17, 2024, with registration opening February 1st.</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover-lift backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-3 text-secondary">What's the team size limit?</h3>
              <p className="text-muted-foreground">Teams can have 2-4 members. Solo participation is also welcome!</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover-lift backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-3 text-primary">Are there prizes?</h3>
              <p className="text-muted-foreground">Yes! We have $50,000 in total prizes across multiple categories including Best Overall, Most Creative, and Best Use of AI.</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover-lift backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-3 text-accent-foreground">Is it free to participate?</h3>
              <p className="text-muted-foreground">Absolutely! The hackathon is completely free, including meals, swag, and access to all workshops.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}