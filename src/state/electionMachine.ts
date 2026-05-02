import { setup, assign } from 'xstate';

export type ElectionContext = {
  memberId: string;
  age: number;
  voterId: string | undefined;
  checklist: {
    registered: boolean;
    detailsVerified: boolean;
    boothFound: boolean;
    voted: boolean;
  };
};

export const electionMachine = setup({
  types: {
    context: {} as ElectionContext,
    events: {} as
      | { type: 'SET_AGE'; age: number }
      | { type: 'REGISTER'; voterId: string }
      | { type: 'VERIFY_DETAILS' }
      | { type: 'FIND_BOOTH' }
      | { type: 'VOTE' }
      | { type: 'RESET' },
  },
  actions: {
    assignAge: assign({
      age: ({ event }) => (event.type === 'SET_AGE' ? event.age : 0),
    }),
    assignVoterId: assign({
      voterId: ({ event }) => (event.type === 'REGISTER' ? event.voterId : undefined),
      checklist: ({ context }) => ({ ...context.checklist, registered: true }),
    }),
    markDetailsVerified: assign({
      checklist: ({ context }) => ({ ...context.checklist, detailsVerified: true }),
    }),
    markBoothFound: assign({
      checklist: ({ context }) => ({ ...context.checklist, boothFound: true }),
    }),
    markVoted: assign({
      checklist: ({ context }) => ({ ...context.checklist, voted: true }),
    }),
  },
  guards: {
    isEligible: ({ context, event }) => {
      if (event.type === 'SET_AGE') return event.age >= 18;
      return context.age >= 18;
    },
    isNotEligible: ({ context, event }) => {
      if (event.type === 'SET_AGE') return event.age < 18;
      return context.age < 18;
    },
  },
}).createMachine({
  id: 'election',
  initial: 'onboarding',
  context: {
    memberId: '',
    age: 0,
    voterId: undefined,
    checklist: {
      registered: false,
      detailsVerified: false,
      boothFound: false,
      voted: false,
    },
  },
  states: {
    onboarding: {
      on: {
        SET_AGE: [
          { target: 'registration', guard: 'isEligible', actions: 'assignAge' },
          { target: 'ineligible', guard: 'isNotEligible', actions: 'assignAge' },
        ],
      },
    },
    ineligible: {
      on: {
        RESET: { target: 'onboarding' },
      },
    },
    registration: {
      on: {
        REGISTER: {
          target: 'verifyDetails',
          actions: 'assignVoterId',
        },
      },
    },
    verifyDetails: {
      on: {
        VERIFY_DETAILS: {
          target: 'booth',
          actions: 'markDetailsVerified',
        },
      },
    },
    booth: {
      on: {
        FIND_BOOTH: {
          target: 'voting',
          actions: 'markBoothFound',
        },
      },
    },
    voting: {
      on: {
        VOTE: {
          target: 'completion',
          actions: 'markVoted',
        },
      },
    },
    completion: {
      type: 'final',
    },
  },
});
