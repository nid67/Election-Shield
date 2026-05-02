import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { FamilyMember } from "@/types";

export const getFamilyMembers = async (userId: string): Promise<FamilyMember[]> => {
  const membersRef = collection(db, `users/${userId}/familyMembers`);
  const snapshot = await getDocs(membersRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FamilyMember));
};

export const addFamilyMember = async (userId: string, member: Omit<FamilyMember, "id" | "createdAt">) => {
  const membersRef = collection(db, `users/${userId}/familyMembers`);
  const docRef = await addDoc(membersRef, {
    ...member,
    createdAt: Date.now()
  });
  return docRef.id;
};

export const updateFamilyMember = async (userId: string, memberId: string, updates: Partial<FamilyMember>) => {
  const memberRef = doc(db, `users/${userId}/familyMembers`, memberId);
  await updateDoc(memberRef, updates);
};

export const deleteFamilyMember = async (userId: string, memberId: string) => {
  const memberRef = doc(db, `users/${userId}/familyMembers`, memberId);
  await deleteDoc(memberRef);
};
