"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { FamilyMember } from "@/types";
import { getFamilyMembers, addFamilyMember, deleteFamilyMember } from "@/services/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, User, Trash2, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", age: "" });

  const loadMembers = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getFamilyMembers(user.uid);
      setMembers(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load family members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadMembers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const ageNum = parseInt(newMember.age);
      if (isNaN(ageNum) || ageNum <= 0) {
        toast.error("Please enter a valid age");
        return;
      }

      await addFamilyMember(user.uid, {
        name: newMember.name,
        age: ageNum,
        status: 'NOT_REGISTERED',
        checklist: {
          registered: false,
          detailsVerified: false,
          boothFound: false,
          voted: false
        }
      });
      
      toast.success("Family member added successfully");
      setIsAddOpen(false);
      setNewMember({ name: "", age: "" });
      loadMembers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add member");
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (confirm("Are you sure you want to remove this member?")) {
      try {
        await deleteFamilyMember(user.uid, id);
        toast.success("Member removed");
        loadMembers();
      } catch (error) {
        console.error(error);
        toast.error("Failed to remove member");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'VOTED': return <Badge className="bg-green-500">Voted</Badge>;
      case 'BOOTH_ASSIGNED': return <Badge className="bg-blue-500">Ready to Vote</Badge>;
      case 'REGISTERED': return <Badge className="bg-yellow-500">Registered</Badge>;
      default: return <Badge variant="secondary">Not Registered</Badge>;
    }
  };

  const calculateProgress = (checklist: FamilyMember['checklist']) => {
    const values = Object.values(checklist);
    const completed = values.filter(Boolean).length;
    return (completed / values.length) * 100;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Family Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your family's election journey.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
            <Plus className="w-4 h-4 mr-2" /> Add Family Member
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Family Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMember} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  required 
                  value={newMember.name} 
                  onChange={e => setNewMember({...newMember, name: e.target.value})}
                  placeholder="e.g. Rahul Kumar"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  type="number" 
                  required 
                  min="1"
                  value={newMember.age} 
                  onChange={e => setNewMember({...newMember, age: e.target.value})}
                  placeholder="e.g. 24"
                />
              </div>
              <Button type="submit" className="w-full mt-2">Add Member</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-4">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-2 w-full mt-4" />
                <Skeleton className="h-10 w-full mt-6" />
              </CardContent>
            </Card>
          ))
        ) : members.length === 0 ? (
          <div className="col-span-full py-16 text-center border-2 border-dashed rounded-xl bg-slate-50/50">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No family members yet</h3>
            <p className="text-slate-500 mt-1 max-w-sm mx-auto">Add your family members to start guiding them through the election process.</p>
          </div>
        ) : (
          members.map(member => (
            <Card key={member.id} className="group overflow-hidden border-slate-200 hover:border-primary/50 hover:shadow-md transition-all">
              <CardHeader className="pb-3 border-b bg-slate-50/50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">{member.age} years old</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(member.status)}
                    <button onClick={() => handleDelete(member.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 focus:opacity-100" aria-label={`Delete ${member.name}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Journey Progress</span>
                      <span className="font-bold text-primary">{calculateProgress(member.checklist)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000 ease-out" 
                        style={{ width: `${calculateProgress(member.checklist)}%` }}
                      />
                    </div>
                  </div>
                  <Link href={`/dashboard/member/${member.id}`} className="block mt-4">
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Activity className="w-4 h-4 mr-2" />
                      Manage Journey
                      <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
