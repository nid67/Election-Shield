import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFamilyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember } from '../db';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Mock Firebase and Firestore
vi.mock('../firebase', () => ({
  db: {} // Mock db object
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
}));

describe('Firestore Database Services', () => {
  const mockUserId = 'user123';
  const mockMemberId = 'member123';
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch family members correctly', async () => {
    const mockData = [
      { id: '1', data: () => ({ name: 'John Doe', age: 25 }) },
      { id: '2', data: () => ({ name: 'Jane Doe', age: 22 }) }
    ];
    
    (getDocs as any).mockResolvedValue({ docs: mockData });
    (collection as any).mockReturnValue('mockCollectionRef');

    const result = await getFamilyMembers(mockUserId);
    
    expect(collection).toHaveBeenCalledWith(db, `users/${mockUserId}/familyMembers`);
    expect(getDocs).toHaveBeenCalledWith('mockCollectionRef');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ id: '1', name: 'John Doe', age: 25 });
  });

  it('should add a family member correctly', async () => {
    const newMember = {
      name: 'Alice',
      age: 30,
      status: 'NOT_REGISTERED' as const,
      checklist: { registered: false, detailsVerified: false, boothFound: false, voted: false }
    };
    
    (addDoc as any).mockResolvedValue({ id: 'newId123' });
    (collection as any).mockReturnValue('mockCollectionRef');
    
    const resultId = await addFamilyMember(mockUserId, newMember);
    
    expect(collection).toHaveBeenCalledWith(db, `users/${mockUserId}/familyMembers`);
    expect(addDoc).toHaveBeenCalled();
    // we can't test exactly with createdAt since it's dynamic, but we can verify it returns id
    expect(resultId).toBe('newId123');
  });

  it('should update a family member correctly', async () => {
    (doc as any).mockReturnValue('mockDocRef');
    
    await updateFamilyMember(mockUserId, mockMemberId, { status: 'REGISTERED' });
    
    expect(doc).toHaveBeenCalledWith(db, `users/${mockUserId}/familyMembers`, mockMemberId);
    expect(updateDoc).toHaveBeenCalledWith('mockDocRef', { status: 'REGISTERED' });
  });

  it('should delete a family member correctly', async () => {
    (doc as any).mockReturnValue('mockDocRef');
    
    await deleteFamilyMember(mockUserId, mockMemberId);
    
    expect(doc).toHaveBeenCalledWith(db, `users/${mockUserId}/familyMembers`, mockMemberId);
    expect(deleteDoc).toHaveBeenCalledWith('mockDocRef');
  });
});
