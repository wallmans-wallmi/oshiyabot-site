/**
 * Intake state machine for the Oshiya chat agent
 * 
 * Represents the logical states of the product intake flow.
 * The actual implementation uses numeric steps, but this type
 * provides a semantic representation of the state machine.
 */

/**
 * Intake state enumeration
 */
export type IntakeState =
  | 'idle'
  | 'collecting_product_name'
  | 'collecting_product_url'
  | 'collecting_target_type'
  | 'collecting_target_value'
  | 'collecting_phone'
  | 'waiting_for_otp_verification'
  | 'intake_complete';

/**
 * Map of step numbers to intake states
 * 
 * This is a helper to understand the mapping between
 * numeric steps (used in ConversationState.step) and
 * semantic states (IntakeState).
 * 
 * Note: The mapping may vary based on the conversation path
 * ('has-product' vs 'needs-help'), but this represents
 * the general flow.
 */
export const STEP_TO_STATE_MAP: Partial<Record<number, IntakeState>> = {
  0: 'idle',
  1: 'collecting_product_name',
  2: 'collecting_product_name',
  3: 'collecting_product_url',
  4: 'collecting_product_url',
  5: 'collecting_target_type',
  6: 'collecting_target_value',
  7: 'collecting_phone',
  8: 'waiting_for_otp_verification', // After phone collection, before OTP verification
  9: 'intake_complete', // After OTP verification and final confirmation
};

/**
 * Get the intake state from a conversation state
 * 
 * @param path - The conversation path ('initial' | 'has-product' | 'needs-help')
 * @param step - The current step number
 * @returns The corresponding IntakeState
 */
export function getIntakeState(
  path: 'initial' | 'has-product' | 'needs-help',
  step: number
): IntakeState {
  if (path === 'initial') {
    return 'idle';
  }

  // Map step to state based on the mapping
  const state = STEP_TO_STATE_MAP[step];
  if (state) {
    return state;
  }

  // Default fallback
  if (step >= 9) {
    return 'intake_complete';
  }

  return 'idle';
}

