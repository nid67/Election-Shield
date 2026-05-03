import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { FamilyMember } from "@/types";

/**
 * Retrieves all family members associated with a specific user.
 * @param userId - The unique identifier of the user
 * @returns An array of family member objects
 */
export const getFamilyMembers = async (userId: string): Promise<FamilyMember[]> => {
  const membersRef = collection(db, `users/${userId}/familyMembers`);
  const snapshot = await getDocs(membersRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FamilyMember));
};

/**
 * Adds a new family member to the user's dashboard.
 * @param userId - The unique identifier of the user
 * @param member - The family member data (excluding system-generated fields)
 * @returns The ID of the newly created document
 */
export const addFamilyMember = async (userId: string, member: Omit<FamilyMember, "id" | "createdAt">) => {
  const membersRef = collection(db, `users/${userId}/familyMembers`);
  const docRef = await addDoc(membersRef, {
    ...member,
    createdAt: Date.now()
  });
  return docRef.id;
};

/**
 * Updates an existing family member's information.
 * @param userId - The unique identifier of the user
 * @param memberId - The ID of the family member to update
 * @param updates - Partial object containing the fields to update
 */
export const updateFamilyMember = async (userId: string, memberId: string, updates: Partial<FamilyMember>) => {
  const memberRef = doc(db, `users/${userId}/familyMembers`, memberId);
  await updateDoc(memberRef, updates);
};

/**
 * Removes a family member from the user's dashboard.
 * @param userId - The unique identifier of the user
 * @param memberId - The ID of the family member to delete
 */
export const deleteFamilyMember = async (userId: string, memberId: string) => {
  const memberRef = doc(db, `users/${userId}/familyMembers`, memberId);
  await deleteDoc(memberRef);
};
