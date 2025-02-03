import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const { theme } = useTheme();

  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Expert Stylists",
      description: "Our team of skilled professionals brings years of experience and passion to every cut."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Premium Services",
      description: "From classic cuts to modern styles, we offer a full range of premium grooming services."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: "Modern Facilities",
      description: "Experience comfort in our state-of-the-art facilities equipped with the latest tools."
    }
  ];

  const stats = [
    { number: "10+", label: "Years Experience" },
    { number: "50K+", label: "Happy Clients" },
    { number: "25+", label: "Expert Barbers" },
    { number: "4.9", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background.primary }}>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            backgroundImage: 'url(/images/about-hero.jpg)',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            filter: 'brightness(0.3)'
          }}
        />
        <motion.div 
          className="relative z-10 text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{ color: theme.colors.text.inverse }}
          >
            About Us
          </h1>
          <p 
            className="text-xl md:text-2xl max-w-3xl mx-auto"
            style={{ color: 'rgba(255, 255, 255, 0.9)' }}
          >
            Crafting confidence through exceptional grooming experiences since 2013
          </p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: theme.colors.text.primary }}
            >
              Our Mission
            </h2>
            <p 
              className="text-lg md:text-xl max-w-3xl mx-auto"
              style={{ color: theme.colors.text.secondary }}
            >
              To provide an exceptional grooming experience that combines traditional craftsmanship with modern style, 
              helping every client look and feel their absolute best.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-6 rounded-2xl"
                style={{ backgroundColor: theme.colors.background.card }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div 
                  className="mb-4"
                  style={{ color: theme.colors.accent.primary }}
                >
                  {feature.icon}
                </div>
                <h3 
                  className="text-xl font-semibold mb-3"
                  style={{ color: theme.colors.text.primary }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-base"
                  style={{ color: theme.colors.text.secondary }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        className="py-20 px-4"
        style={{ backgroundColor: theme.colors.background.secondary }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 
                  className="text-4xl md:text-5xl font-bold mb-2"
                  style={{ color: theme.colors.accent.primary }}
                >
                  {stat.number}
                </h3>
                <p 
                  className="text-sm md:text-base"
                  style={{ color: theme.colors.text.secondary }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: theme.colors.text.primary }}
            >
              Our Values
            </h2>
            <p 
              className="text-lg md:text-xl max-w-3xl mx-auto"
              style={{ color: theme.colors.text.secondary }}
            >
              We believe in creating an environment where every client feels welcome, valued, and confident 
              in their appearance. Our commitment to excellence drives everything we do.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 