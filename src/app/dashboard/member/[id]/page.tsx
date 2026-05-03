"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { FamilyMember } from "@/types";
import { useMachine } from "@xstate/react";
import { electionMachine } from "@/state/electionMachine";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Circle, ArrowLeft, Bot, MapPin } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { askElectionAI } from "@/app/actions/ai";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";

export default function MemberJourneyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { user } = useAuth();
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [loading, setLoading] = useState(true);
  
  // AI State
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  // XState
  const [state, send] = useMachine(electionMachine);

  const loadMember = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, `users/${user.uid}/familyMembers`, id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as FamilyMember;
        setMember({ ...data, id: snap.id });
        
        // Initialize machine state based on DB
        send({ type: 'SET_AGE', age: data.age });
        
        // Fast-forward machine if already progressed (in a real app, state string would be saved)
        if (data.checklist.registered) send({ type: 'REGISTER', voterId: data.voterId || 'TEMP' });
        if (data.checklist.detailsVerified) send({ type: 'VERIFY_DETAILS' });
        if (data.checklist.boothFound) send({ type: 'FIND_BOOTH' });
        if (data.checklist.voted) send({ type: 'VOTE' });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load member details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && id) {
      loadMember();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]);

  const updateMemberChecklist = async (updates: Partial<FamilyMember['checklist']>, newStatus?: FamilyMember['status']) => {
    if (!user || !member) return;
    const docRef = doc(db, `users/${user.uid}/familyMembers`, member.id);
    const newChecklist = { ...member.checklist, ...updates };
    const updateData: Record<string, unknown> = { checklist: newChecklist };
    if (newStatus) updateData.status = newStatus;
    
    await updateDoc(docRef, updateData);
    setMember({ ...member, checklist: newChecklist, ...(newStatus && { status: newStatus }) });
  };

  const handleRegister = () => {
    send({ type: 'REGISTER', voterId: 'VOTER12345' });
    updateMemberChecklist({ registered: true }, 'REGISTERED');
    toast.success("Marked as registered!");
  };

  const handleVerify = () => {
    send({ type: 'VERIFY_DETAILS' });
    updateMemberChecklist({ detailsVerified: true });
    toast.success("Details verified!");
  };

  const handleFindBooth = () => {
    send({ type: 'FIND_BOOTH' });
    updateMemberChecklist({ boothFound: true }, 'BOOTH_ASSIGNED');
    toast.success("Booth assigned!");
  };

  const handleVote = () => {
    send({ type: 'VOTE' });
    updateMemberChecklist({ voted: true }, 'VOTED');
    toast.success("Voting completed!");
  };

  const askAI = async () => {
    const trimmedQuestion = question.trim().toLowerCase();
    if (!trimmedQuestion || !member) return;
    
    // Check Cache first
    const cacheKey = `ai_cache_${member.id}_${trimmedQuestion}`;
    const cachedResponse = localStorage.getItem(cacheKey);
    
    if (cachedResponse) {
      setAnswer(cachedResponse);
      return;
    }

    setAsking(true);
    try {
      const res = await askElectionAI(
        { 
          age: member.age, 
          registered: member.checklist.registered,
          name: member.name,
          currentState: state.value as string
        }, 
        question
      );
      setAnswer(res);
      // Save to Cache
      localStorage.setItem(cacheKey, res);
    } catch (err) {
      console.error(err);
      toast.error("AI service is currently busy. Please try again.");
    } finally {
      setAsking(false);
    }
  };

  if (loading || !member) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" aria-label="Go back to dashboard">
          <Button variant="outline" size="icon" aria-label="Back"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{member.name}'s Journey</h1>
          <p className="text-slate-500 text-sm">Age: {member.age}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Step: {state.value as string}</CardTitle>
              <CardDescription>Follow these steps to complete the election process safely.</CardDescription>
            </CardHeader>
            <CardContent>
              {state.matches('ineligible') && (
                <div className="p-6 bg-red-50 text-red-800 rounded-lg border border-red-200">
                  <h3 className="font-bold text-lg mb-2">Not Eligible to Vote</h3>
                  <p>Family members under 18 cannot register to vote. They can participate by learning about the process!</p>
                </div>
              )}

              {state.matches('registration') && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-bold text-blue-900 mb-2">Step 1: Voter Registration</h3>
                    <p className="text-sm text-blue-800 mb-4">You need to register as a voter to participate in the elections.</p>
                    <Button onClick={handleRegister}>Mark as Registered</Button>
                  </div>
                </div>
              )}

              {state.matches('verifyDetails') && (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h3 className="font-bold text-purple-900 mb-2">Step 2: Verify Voter Details</h3>
                    <p className="text-sm text-purple-800 mb-4">Check the electoral roll to ensure your name and details are correct.</p>
                    <Button onClick={handleVerify} className="bg-purple-600 hover:bg-purple-700">Verify Details</Button>
                  </div>
                </div>
              )}

              {state.matches('booth') && (
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h3 className="font-bold text-orange-900 mb-2">Step 3: Find Polling Booth</h3>
                    <p className="text-sm text-orange-800 mb-4">Locate your designated polling booth before the election day.</p>
                    <Button onClick={handleFindBooth} className="bg-orange-600 hover:bg-orange-700">Assign Nearest Booth</Button>
                  </div>
                </div>
              )}

              {state.matches('voting') && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-bold text-green-900 mb-2">Step 4: Voting Day</h3>
                    <p className="text-sm text-green-800 mb-4">It's time to cast your vote! Remember to bring your ID.</p>
                    <Button onClick={handleVote} className="bg-green-600 hover:bg-green-700">Mark as Voted!</Button>
                  </div>
                </div>
              )}

              {state.matches('completion') && (
                <div className="p-8 text-center bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl border border-green-200">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-2xl text-green-900 mb-2">Journey Complete!</h3>
                  <p className="text-green-800">Thank you for participating in the democratic process.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Assistant Section */}
          <Card className="border-primary/20 shadow-md">
            <CardHeader className="bg-primary/5 border-b pb-4">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Bot className="w-5 h-5" /> Election Co-Pilot AI
              </CardTitle>
              <CardDescription>Ask any question about {member.name}'s specific situation.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="e.g. What documents do I need to carry?" 
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && askAI()}
                />
                <Button onClick={askAI} disabled={asking || !question.trim()}>
                  {asking ? "Thinking..." : "Ask"}
                </Button>
              </div>
              {answer && (
                <div className="p-4 bg-slate-50 rounded-lg text-sm leading-relaxed border border-slate-200">
                  <div className="font-semibold mb-2 text-slate-700">Answer:</div>
                  <div className="text-slate-600 prose prose-sm max-w-none">
                    <ReactMarkdown>{answer}</ReactMarkdown>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Checklist Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 'registered', label: 'Registered to Vote', done: member.checklist.registered },
                  { id: 'detailsVerified', label: 'Details Verified', done: member.checklist.detailsVerified },
                  { id: 'boothFound', label: 'Booth Assigned', done: member.checklist.boothFound },
                  { id: 'voted', label: 'Voted', done: member.checklist.voted },
                ].map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.done ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${item.done ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {member.checklist.boothFound && !member.checklist.voted && (
             <Card className="bg-slate-900 text-white overflow-hidden">
             <div className="p-6">
               <div className="flex items-center gap-2 text-blue-400 mb-4">
                 <MapPin className="w-5 h-5" />
                 <h3 className="font-semibold">Assigned Booth</h3>
               </div>
               <p className="text-xl font-bold mb-1">St. Mary's High School</p>
               <p className="text-slate-400 text-sm mb-4">Room 4, Building B</p>
               <Button 
                 className="w-full bg-blue-600 hover:bg-blue-700"
                 onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("St. Mary's High School, Polling Booth")}`, '_blank')}
               >
                 Get Directions
               </Button>
             </div>
           </Card>
          )}
        </div>
      </div>
    </div>
  );
}
