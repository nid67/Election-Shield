export type UserProfile = {
  uid: string;
  email: string;
  displayName: string | null;
  createdAt: number;
};

export type MemberStatus = 'NOT_REGISTERED' | 'REGISTERED' | 'BOOTH_ASSIGNED' | 'VOTED';

export type FamilyMember = {
  id: string;
  name: string;
  age: number;
  voterId?: string;
  status: MemberStatus;
  checklist: {
    registered: boolean;
    detailsVerified: boolean;
    boothFound: boolean;
    voted: boolean;
  };
  createdAt: number;
};
