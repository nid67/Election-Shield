"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, MapPin, MessageSquareText } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="px-6 h-20 flex items-center justify-between border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-2xl text-primary">
          <Shield className="w-8 h-8" />
          <span>Election Shield</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-medium">Sign In</Button>
          </Link>
          <Link href="/login">
            <Button className="font-medium shadow-md">Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-24 md:py-32 lg:py-48 px-6 flex flex-col items-center text-center bg-gradient-to-b from-blue-50 to-slate-50">
          <div className="max-w-4xl space-y-8">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
              Your Family's Election Co-Pilot
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-slate-900 leading-tight">
              Manage your family's <br/>
              <span className="text-primary">voting journey</span> safely.
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-slate-600 leading-relaxed">
              A guided, personalized experience to ensure everyone in your family is registered, finds their booth, and votes with confidence.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Link href="/login">
                <Button size="lg" className="h-14 px-8 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all">
                  Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Features built for families</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">Everything you need to navigate the election process, together.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Users, title: "Family Dashboard", desc: "Manage multiple family members from a single intuitive interface. Track everyone's progress." },
                { icon: MessageSquareText, title: "AI Co-Pilot", desc: "Get intelligent, scenario-based answers to any election-related questions specific to your situation." },
                { icon: MapPin, title: "Booth Finder", desc: "Automatically locate the nearest polling booth and get precise directions for voting day." },
              ].map((feat, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
                  <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                    <feat.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{feat.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 border-t bg-white text-center text-slate-500">
        <p>© 2026 Election Shield. Built for the Google AI Hackathon.</p>
      </footer>
    </div>
  );
}
