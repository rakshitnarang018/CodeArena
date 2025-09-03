import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, MapPin, Phone, Heart, Sparkles, Trophy, Users } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Browse Events', href: '/events' },
      { name: 'Host Event', href: '/create-event' },
      { name: 'Competitions', href: '/competitions' },
      { name: 'Workshops', href: '/workshops' },
      { name: 'Internships', href: '/internships' },
      { name: 'Jobs', href: '/jobs' },
    ],
    community: [
      { name: 'Discord', href: '#' },
      { name: 'Forum', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Newsletter', href: '#' },
      { name: 'Mentorship', href: '#' },
      { name: 'Success Stories', href: '#' },
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'FAQs', href: '#' },
      { name: 'Guidelines', href: '#' },
      { name: 'API Docs', href: '#' },
      { name: 'Status', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Partners', href: '#' },
      { name: 'Investors', href: '#' },
      { name: 'Brand Kit', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'GDPR', href: '#' },
      { name: 'Security', href: '#' },
    ],
  };

  const socialLinks = [
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'Email', href: 'mailto:hello@codearena.com', icon: Mail },
  ];

  const stats = [
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Events Hosted', value: '1K+', icon: Trophy },
    { label: 'Success Rate', value: '95%', icon: Sparkles },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      
      <div className="relative border-t border-border/50">
        {/* Stats Section */}
        <div className="border-b border-border/30">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={stat.label} className="group">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-2xl md:text-3xl font-bold text-foreground">
                        {stat.value}
                      </span>
                    </div>
                    <p className="text-muted-foreground font-medium">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-6 group">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  CodeArena
                </span>
              </Link>
              <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
                The modern platform for hackathons, competitions, and tech events. 
                Connecting innovators and building the future together.
              </p>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 hover:shadow-md"
                    aria-label={social.name}
                  >
                    <social.icon className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Platform</h3>
              <ul className="space-y-3">
                {footerLinks.platform.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Community</h3>
              <ul className="space-y-3">
                {footerLinks.community.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Support</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t border-border/30 mt-12 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Location</p>
                  <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Phone</p>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">hello@codearena.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-border/30 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © {currentYear} CodeArena. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-muted-foreground text-sm mt-4 md:mt-0">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>for the developer community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
