import { describe, it, expect } from 'vitest';
import { createActor } from 'xstate';
import { electionMachine } from '../electionMachine';

describe('electionMachine', () => {
  it('should transition to ineligible if age is under 18', () => {
    const actor = createActor(electionMachine).start();
    
    actor.send({ type: 'SET_AGE', age: 17 });
    expect(actor.getSnapshot().value).toBe('ineligible');
    expect(actor.getSnapshot().context.age).toBe(17);
  });

  it('should transition to registration if age is 18 or older', () => {
    const actor = createActor(electionMachine).start();
    
    actor.send({ type: 'SET_AGE', age: 18 });
    expect(actor.getSnapshot().value).toBe('registration');
    expect(actor.getSnapshot().context.age).toBe(18);
  });

  it('should complete the full election flow correctly', () => {
    const actor = createActor(electionMachine).start();
    
    // Step 1: Set Age
    actor.send({ type: 'SET_AGE', age: 25 });
    expect(actor.getSnapshot().value).toBe('registration');
    
    // Step 2: Register
    actor.send({ type: 'REGISTER', voterId: 'VOTER123' });
    expect(actor.getSnapshot().value).toBe('verifyDetails');
    expect(actor.getSnapshot().context.voterId).toBe('VOTER123');
    expect(actor.getSnapshot().context.checklist.registered).toBe(true);

    // Step 3: Verify Details
    actor.send({ type: 'VERIFY_DETAILS' });
    expect(actor.getSnapshot().value).toBe('booth');
    expect(actor.getSnapshot().context.checklist.detailsVerified).toBe(true);

    // Step 4: Find Booth
    actor.send({ type: 'FIND_BOOTH' });
    expect(actor.getSnapshot().value).toBe('voting');
    expect(actor.getSnapshot().context.checklist.boothFound).toBe(true);

    // Step 5: Vote
    actor.send({ type: 'VOTE' });
    expect(actor.getSnapshot().value).toBe('completion');
    expect(actor.getSnapshot().context.checklist.voted).toBe(true);
  });
});
