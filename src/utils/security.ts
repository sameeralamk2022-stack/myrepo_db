export const DEFAULT_PIN = '1111';

export function isAppLocked(): boolean {
  const locked = localStorage.getItem('meerut_bites_locked');
  return locked === 'true';
}

export function setAppLock(locked: boolean): void {
  localStorage.setItem('meerut_bites_locked', String(locked));
}

export function verifyPin(pin: string): boolean {
  const storedPin = localStorage.getItem('meerut_bites_pin') || DEFAULT_PIN;
  return pin === storedPin;
}

export function updatePin(newPin: string): void {
  localStorage.setItem('meerut_bites_pin', newPin);
}