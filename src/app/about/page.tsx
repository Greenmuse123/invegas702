import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="flex justify-center mb-8">
          <Image
            src="/images/invegas702 logo.png"
            alt="InVegas702 Logo"
            width={300}
            height={150}
            className="object-contain"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-red-600">About InVegas702</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Your premier guide to the heart and soul of Las Vegas - where the extraordinary becomes everyday.
        </p>
      </section>

      {/* Introduction Section */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-red-600">Discover the Real Las Vegas</h2>
            <p className="text-gray-300 mb-4">
              InVegas702 is more than just a magazine - we're your insider's guide to the vibrant culture, 
              diverse cuisine, exciting events, and remarkable people that make Las Vegas truly unique.
            </p>
            <p className="text-gray-300">
              As locals, we experience the best of both worlds: the dazzling entertainment of the Strip 
              and the authentic community spirit that thrives beyond it. We're here to share these 
              experiences with you, connecting visitors and residents alike to the real heartbeat of our city.
            </p>
          </div>
          <div className="relative h-96">
            <Image
              src="/images/about-hero.jpg"
              alt="Las Vegas skyline"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mb-16 bg-red-900/20 p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-red-600">Our Mission</h2>
        <p className="text-gray-300 text-lg">
          At InVegas702, we're committed to building a stronger, more connected community. 
          We believe in collaboration over competition, in lifting each other up rather than 
          tearing each other down. Our mission is to create a platform where local businesses, 
          artists, and community members can thrive together, celebrating the unique spirit 
          that makes Las Vegas more than just a tourist destination - it's our home.
        </p>
      </section>

      {/* Vision Section */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-96">
            <Image
              src="/images/vision.jpg"
              alt="Creative community"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6 text-red-600">Our Vision</h2>
            <p className="text-gray-300 mb-4">
              We envision a Las Vegas where creativity knows no bounds, where innovation 
              leads the way in connecting our community. Through our platform, we're 
              pioneering new ways to bring people together, whether through our digital 
              content, community events, or collaborative projects.
            </p>
            <p className="text-gray-300">
              Our vision extends beyond traditional media - we're building a movement 
              that celebrates the diversity, creativity, and resilience of our city.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-12 text-center text-red-600">Our Core Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-red-900/20 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-red-600">Creativity</h3>
            <p className="text-gray-300">
              We embrace innovative thinking and artistic expression in everything we do, 
              constantly pushing boundaries to deliver fresh perspectives on Las Vegas life.
            </p>
          </div>
          <div className="bg-red-900/20 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-red-600">Communication</h3>
            <p className="text-gray-300">
              We believe in clear, honest, and engaging communication that bridges gaps 
              and builds understanding within our community.
            </p>
          </div>
          <div className="bg-red-900/20 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-red-600">Invention</h3>
            <p className="text-gray-300">
              We're not afraid to try new things, experiment with different formats, 
              and find unique ways to tell the stories of our city.
            </p>
          </div>
          <div className="bg-red-900/20 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-red-600">Community</h3>
            <p className="text-gray-300">
              At our core, we're about bringing people together, fostering connections, 
              and creating a sense of belonging in our vibrant city.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6 text-red-600">Join Our Community</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Whether you're a long-time resident or a first-time visitor, there's a place for you 
          in the InVegas702 community. Subscribe to our magazine, follow us on social media, 
          or attend our events to become part of the conversation.
        </p>
        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
          Subscribe Now
        </button>
      </section>
    </main>
  );
} 