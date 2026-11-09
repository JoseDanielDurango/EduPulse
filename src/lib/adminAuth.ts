import { User } from 'firebase/auth';

/**
 * Official authorized researcher emails for the UniCórdoba thesis:
 * "La formación docente en la era de la inteligencia artificial: desafíos y perspectivas en la Universidad de Córdoba"
 */
export const AUTHORIZED_RESEARCHER_EMAILS: readonly string[] = [
  'jdurangocaballero59@correo.unicordoba.edu.co', // José Daniel Durango Caballero (Author)
  'josedudaca@gmail.com',                         // José Daniel Durango Caballero (Personal)
  'jramirezoviedo06@correo.unicordoba.edu.co',     // Jefersson Ramírez Oviedo (Author)
  'jgiraldo@correo.unicordoba.edu.co',             // Juan Carlos Giraldo Cardozo (Director)
];

/**
 * Secret master passcode / PIN for instant researcher unlocking on any device.
 */
export const RESEARCHER_MASTER_PIN = 'unicordoba2026';

const STORAGE_KEY = 'edupulse_researcher_pin_unlocked';

/**
 * Checks whether a given Firebase User has researcher / admin privileges.
 */
export const isUserAdmin = (user: User | null): boolean => {
  if (!user || !user.email) return false;
  const userEmail = user.email.trim().toLowerCase();
  return AUTHORIZED_RESEARCHER_EMAILS.some(
    (authorized) => authorized.trim().toLowerCase() === userEmail
  );
};

/**
 * Checks if the researcher role has been unlocked via PIN on this device/session.
 */
export const isPinUnlocked = (): boolean => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'true' || localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

/**
 * Validates PIN and unlocks researcher privileges.
 */
export const verifyAndUnlockPin = (pin: string, rememberOnDevice = false): boolean => {
  if (pin.trim() === RESEARCHER_MASTER_PIN) {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      if (rememberOnDevice) {
        localStorage.setItem(STORAGE_KEY, 'true');
      }
    } catch {
      // Ignore storage errors
    }
    return true;
  }
  return false;
};

/**
 * Relocks researcher privileges if unlocked via PIN.
 */
export const lockResearcherPin = (): void => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
};
