"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from "@/lib/supabase";

// Define a type for team members
interface TeamMember {
  id: string;
  name: string;
  role: string;
  image_url?: string;
  superpowers?: string[];
  sort_order?: number;
}

export default function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  useEffect(() => {
    async function fetchTeam() {
      const { data, error } = await supabase
        .from("team_members")
        .select("id, name, role, image_url, superpowers, sort_order")
        .order("sort_order", { ascending: true });
      if (!error) setTeam(data || []);
    }
    fetchTeam();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-15">
        <div className="absolute top-0 right-0 w-2/3 h-screen bg-gradient-to-bl from-red-900/40 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-screen bg-gradient-to-tr from-red-900/40 via-transparent to-transparent"></div>
        <div className="absolute inset-0">
          <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 0, 0, 0.15) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 0, 0, 0.1) 2%, transparent 0%)', backgroundSize: '100px 100px' }}></div>
        </div>
      </div>
      
      {/* Moved SVG Overlay - Applied to main container */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image src="/images/las-vegas-overlay.svg" alt="Vegas neon pattern" fill className="object-cover" />
      </div>
      
      {/* Hero Section - Full-width image with overlay text */}
      <section className="relative h-[80vh] w-full overflow-hidden z-10">
        <Image
          src="images/about/about-hero.jpg"
          alt="Las Vegas skyline"
          fill
          priority
          quality={90}
          className="object-cover object-center brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white [text-shadow:_0_2px_10px_rgba(0,0,0,0.7)]">
              About <span className="text-red-500">InVegas702</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl [text-shadow:_0_2px_5px_rgba(0,0,0,0.9)]">
              Your premier guide to the heart and soul of Las Vegas - where the extraordinary becomes everyday.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section - Ruby Ojeda (Themed Medium) */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative flex flex-col md:flex-row items-center gap-10 md:gap-16 bg-gradient-to-br from-gray-900/90 via-black/80 to-red-950/60 rounded-2xl shadow-xl border border-red-900/40 overflow-hidden">
          {/* Subtle red accent bar */}
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-red-600/80 via-transparent to-red-900/40" />
          <div className="w-full md:w-1/3 flex justify-center items-center py-10 md:py-16">
            <div className="relative">
              <Image
                src="/images/about/rubyheadshot.jpg"
                alt="Ruby Ojeda, Founder of InVegas702"
                width={330}
                height={495}
                className="rounded-xl object-cover border-2 border-red-700 shadow-lg shadow-red-900/30 bg-black/30"
                priority
              />
            </div>
          </div>
          <div className="flex-1 px-4 md:px-0 py-10 md:py-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-white flex items-center gap-3">
              <span className="inline-block w-2 h-8 bg-gradient-to-b from-red-500 to-red-900 rounded-full mr-2"></span>
              I’m Ruby Ojeda — <span className="text-red-400">Founder & Creative Director</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-red-500 via-red-700 to-transparent rounded-full mb-6"></div>
            <p className="mb-3 text-gray-200 text-lg">I wear many hats, but each one reflects my passion for telling stories through powerful visuals.</p>
            <p className="mb-3 text-gray-200 text-lg">I founded InVegas702 as a bold, hybrid platform that merges social media, YouTube, and print to elevate how local businesses connect with their audience. We go beyond traditional advertising — crafting authentic, meaningful content that showcases the soul behind every brand we feature.</p>
            <p className="mb-3 text-gray-200 text-lg">As a Latina woman in a male-dominated industry, I bring a diverse and fearless perspective to every project. My background in photography, videography, design, and creative direction allows me to build cohesive, visually compelling campaigns that make an impact.</p>
            <p className="mb-3 text-gray-200 text-lg">I’m proud to contribute to the Las Vegas community by helping entrepreneurs, creatives, and business owners stand out with content that feels as powerful as their story. Whether you need a full-service creative campaign or a one-time shoot, I’m here to bring your vision to life — from concept to final cut.</p>
            <div className="mt-5">
              <h3 className="text-lg font-semibold mb-2 text-red-300">Why Work With Me?</h3>
              <ul className="list-disc pl-5 text-gray-200 text-base space-y-1">
                <li>One creative mind, all-in-one service: photo, video, drone, and design</li>
                <li>Personal, tailored approach for each client</li>
                <li>Deep understanding of brand storytelling in a digital age</li>
                <li>Passionate about community, connection, and creative collaboration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Horizontal Scroll */}
      <section className="container mx-auto px-4 pb-20">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-white flex items-center gap-3">
          <span className="inline-block w-2 h-8 bg-gradient-to-b from-red-500 to-red-900 rounded-full mr-2"></span>
          Meet the Team
        </h2>
        <div className="overflow-x-auto">
          <div className="flex gap-8 pb-4">
            {/* Ruby's Card (hardcoded) */}
            <div className="min-w-[320px] max-w-xs bg-gradient-to-br from-gray-900/90 via-black/80 to-red-950/60 rounded-2xl shadow-xl border border-red-900/40 flex-shrink-0 flex flex-col items-center px-6 py-8">
              <Image
                src="/images/about/rubyheadshot.jpg"
                alt="Ruby Ojeda, Founder of InVegas702"
                width={180}
                height={270}
                className="rounded-xl object-cover border-2 border-red-700 shadow-lg shadow-red-900/30 bg-black/30 mb-4"
                priority
              />
              <h3 className="text-xl font-bold text-white mb-1">Ruby Ojeda</h3>
              <div className="text-red-400 font-semibold mb-3 text-sm">Founder & Creative Director</div>
              <div className="w-12 h-1 bg-gradient-to-r from-red-500 via-red-700 to-transparent rounded-full mb-3"></div>
              <div className="text-gray-200 text-sm mb-2 text-center">What I Bring</div>
              <ul className="list-disc pl-4 text-gray-300 text-sm space-y-1 text-left mb-2">
                <li>Visionary creative direction</li>
                <li>Photography & videography</li>
                <li>Brand storytelling</li>
                <li>Community leadership</li>
              </ul>
            </div>
            {/* Dynamically render team members from Supabase */}
            {team.map((member) => (
              <div key={member.id} className="min-w-[320px] max-w-xs bg-gradient-to-br from-gray-900/80 via-black/80 to-red-950/40 rounded-2xl shadow-xl border border-red-900/40 flex-shrink-0 flex flex-col items-center px-6 py-8">
                <Image
                  src={member.image_url || "/images/about/placeholder.jpg"}
                  alt={member.name}
                  width={180}
                  height={270}
                  className="rounded-xl object-cover border-2 border-red-700 shadow-lg shadow-red-900/30 bg-black/30 mb-4"
                />
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <div className="text-red-400 font-semibold mb-3 text-sm">{member.role}</div>
                <div className="w-12 h-1 bg-gradient-to-r from-red-500 via-red-700 to-transparent rounded-full mb-3"></div>
                <div className="text-gray-200 text-sm mb-2 text-center">What I Bring</div>
                <ul className="list-disc pl-4 text-gray-300 text-sm space-y-1 text-left mb-2">
                  {Array.isArray(member.superpowers)
                    ? member.superpowers.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))
                    : null}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections with alternating layouts */}
      <div className="container mx-auto px-4 py-20 relative">
        <div className="relative z-10">
          {/* Introduction Section */}
          <section className="mb-32">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="md:w-1/2">
                <h2 className="text-4xl font-bold mb-8 text-red-500">Discover the Real Las Vegas</h2>
                <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                  InVegas702 is more than just a magazine - we're your insider's guide to the vibrant culture, 
                  diverse cuisine, exciting events, and remarkable people that make Las Vegas truly unique.
                </p>
                <p className="text-gray-200 text-lg leading-relaxed">
                  As locals, we experience the best of both worlds: the dazzling entertainment of the Strip 
                  and the authentic community spirit that thrives beyond it. We're here to share these 
                  experiences with you, connecting visitors and residents alike to the real heartbeat of our city.
                </p>
              </div>
              <div className="md:w-1/2 h-[500px] relative rounded-lg overflow-hidden shadow-2xl shadow-red-900/30 transform md:translate-y-8">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60"></div>
                <Image
                  src="images/about/about-hero.jpg"
                  alt="Las Vegas skyline"
                  fill
                  quality={90}
                  className="object-cover brightness-110 hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="mb-32 relative">
            <div className="absolute -inset-x-4 -top-12 -bottom-12 bg-gradient-to-r from-red-900/30 via-red-800/20 to-red-900/30 blur-sm rounded-xl -z-10"></div>
            <div className="relative backdrop-blur-sm bg-black/40 rounded-xl p-12 border border-red-900/30">
              <h2 className="text-4xl font-bold mb-8 text-red-500">Our Mission</h2>
              <p className="text-gray-200 text-xl leading-relaxed">
                At InVegas702, we're committed to building a stronger, more connected community. 
                We believe in collaboration over competition, in lifting each other up rather than 
                tearing each other down. Our mission is to create a platform where local businesses, 
                artists, and community members can thrive together, celebrating the unique spirit 
                that makes Las Vegas more than just a tourist destination - it's our home.
              </p>
            </div>
          </section>

          {/* Vision Section - With Arts District Image */}
          <section className="mb-32">
            <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
              <div className="md:w-1/2">
                <h2 className="text-4xl font-bold mb-8 text-red-500">Our Vision</h2>
                <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                  We envision a Las Vegas where creativity knows no bounds, where innovation 
                  leads the way in connecting our community. Through our platform, we're 
                  pioneering new ways to bring people together, whether through our digital 
                  content, community events, or collaborative projects.
                </p>
                <p className="text-gray-200 text-lg leading-relaxed">
                  Our vision extends beyond traditional media - we're building a movement 
                  that celebrates the diversity, creativity, and resilience of our city.
                </p>
              </div>
              <div className="md:w-1/2 h-[500px] relative rounded-lg overflow-hidden shadow-2xl shadow-red-900/30 transform md:-translate-y-8">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-10 opacity-60"></div>
                <Image
                  src="images/about/artsdistrict.jpg"
                  alt="Creative community"
                  fill
                  quality={85}
                  className="object-cover object-left brightness-110 hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </section>

          {/* Values Section - Modern Card Layout */}
          <section className="mb-32">
            <h2 className="text-4xl font-bold mb-16 text-center text-red-500">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Creativity",
                  description: "We embrace innovative thinking and artistic expression in everything we do, constantly pushing boundaries to deliver fresh perspectives on Las Vegas life."
                },
                {
                  title: "Communication",
                  description: "We believe in clear, honest, and engaging communication that bridges gaps and builds understanding within our community."
                },
                {
                  title: "Invention",
                  description: "We're not afraid to try new things, experiment with different formats, and find unique ways to tell the stories of our city."
                },
                {
                  title: "Community",
                  description: "At our core, we're about bringing people together, fostering connections, and creating a sense of belonging in our vibrant city."
                }
              ].map((value, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-gray-900 to-red-950/30 p-8 rounded-xl border border-red-900/30 hover:border-red-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-red-500/30"
                >
                  <h3 className="text-2xl font-bold mb-4 text-red-500 group-hover:text-red-400 transition-colors">{value.title}</h3>
                  <p className="text-gray-200 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action - Modern Button and Layout */}
          <section className="text-center py-24 rounded-2xl relative overflow-hidden mb-20">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-red-950/20 to-gray-900"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5OTAwMDAiIGZpbGwtb3BhY2l0eT0iMC4xNSI+PHBhdGggZD0iTTM2IDM0YzAgMS4xMDUtLjg5NSAyLTIgMnMtMi0uODk1LTItMiAuODk1LTIgMi0yIDIgLjg5NSAyIDJ6bTI1IDBjMCAxLjEwNS0uODk1IDItMiAycy0yLS44OTUtMi0yIC44OTUtMiAyLTIgMiAuODk1IDIgMnoidS8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
            </div>
            
            {/* Content with depth effect */}
            <div className="relative z-10 max-w-4xl mx-auto px-6">
              <h2 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                Join Our Community
              </h2>
              <p className="text-gray-200 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                Whether you're a long-time resident or a first-time visitor, there's a place for you 
                in the InVegas702 community. Subscribe to our magazine, follow us on social media, 
                or attend our events to become part of the conversation.
              </p>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
                <Link 
                  href="/subscribe" 
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-red-500 px-10 py-4 font-bold text-white transition-all duration-300 ease-out hover:bg-red-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/30"
                >
                  <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
                  <span className="relative flex items-center gap-2">
                    Subscribe Now
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </Link>
                
                <div className="flex items-center justify-center space-x-4">
                  {['facebook', 'instagram', 'twitter'].map((social) => (
                    <a 
                      key={social}
                      href={`https://${social}.com/invegas702`} 
                      className="group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-gray-800 to-red-900/40 p-0.5 transition-all duration-300 hover:scale-110"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <div className="absolute inset-0 z-0 rounded-full bg-gray-900 group-hover:bg-red-900/70 transition-colors duration-300"></div>
                      <div className="relative z-10 flex h-full w-full items-center justify-center rounded-full">
                        <span className="sr-only">{social}</span>
                        {social === 'facebook' && (
                          <svg className="h-7 w-7 text-gray-300 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                          </svg>
                        )}
                        {social === 'instagram' && (
                          <svg className="h-7 w-7 text-gray-300 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.467.398.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                          </svg>
                        )}
                        {social === 'twitter' && (
                          <svg className="h-7 w-7 text-gray-300 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}