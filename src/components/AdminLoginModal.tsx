import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  KeyRound,
  LogIn,
  AlertCircle,
  X,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  AUTHORIZED_RESEARCHER_EMAILS,
  RESEARCHER_MASTER_PIN,
  verifyAndUnlockPin,
  isUserAdmin,
} from '../lib/adminAuth';
import { loginWithGoogle } from '../lib/firebase';
import { Language } from '../lib/i18n';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  isAdmin: boolean;
  onAdminStateChange: () => void;
  language: Language;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  isAdmin,
  onAdminStateChange,
  language,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [rememberDevice, setRememberDevice] = useState(true);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      setLoginError(null);
      const { user } = await loginWithGoogle();
      if (user && isUserAdmin(user)) {
        onAdminStateChange();
        onClose();
      } else {
        setLoginError(
          language === 'en'
            ? `Signed in as ${user?.email}, but this account is not in the authorized researchers registry.`
            : `Sesión iniciada como ${user?.email}, pero esta cuenta no está registrada como investigador autorizado.`
        );
      }
    } catch (err: any) {
      setLoginError(err.message || 'Error al iniciar sesión con Google');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAndUnlockPin(pinInput, rememberDevice)) {
      setPinError(false);
      setPinInput('');
      onAdminStateChange();
      onClose();
    } else {
      setPinError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md aero-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/90 dark:border-cyan-500/30 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40 transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-b from-emerald-400 via-teal-500 to-cyan-600 text-white flex items-center justify-center shadow-lg ring-2 ring-white/80 dark:ring-cyan-400/40 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />
            <ShieldCheck className="h-6 w-6 drop-shadow-xs" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
              {language === 'en' ? 'Researcher Portal' : 'Acceso de Investigadores'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-cyan-200/80 font-body">
              {language === 'en'
                ? 'Authorized access for research leads and thesis director'
                : 'Acceso autorizado para tesistas y director de proyecto'}
            </p>
          </div>
        </div>

        {isAdmin ? (
          /* Already Admin View */
          <div className="space-y-5 text-center py-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/80 text-xs font-bold shadow-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>
                {language === 'en'
                  ? 'Active Researcher Privileges'
                  : 'Privilegios de Investigador Activos'}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-body">
              {language === 'en'
                ? 'You have unrestricted access to qualitative sessions, verbatim quotes, hermeneutic matrices, and instrument analytics.'
                : 'Tienes acceso total al historial de entrevistas con Cereza, citas textuales categorizadas, matrices cualitativas y estadísticas de cuestionarios.'}
            </p>

            <button
              onClick={onClose}
              className="btn-aero-green w-full py-2.5 rounded-full text-xs font-bold shadow-md cursor-pointer"
            >
              {language === 'en' ? 'Continue to Dashboard' : 'Continuar al Panel'}
            </button>
          </div>
        ) : (
          /* Unlocking Options */
          <div className="space-y-6">
            {/* Option 1: Google Sign-In with Authorized Email */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'en'
                  ? 'Method 1: Sign in with Google Account'
                  : 'Opción 1: Iniciar sesión con Cuenta de Google'}
              </label>

              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="btn-aero-cyan w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold shadow-md transition active:scale-98 cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                <span>
                  {isLoggingIn
                    ? language === 'en'
                      ? 'Authenticating...'
                      : 'Verificando cuenta...'
                    : language === 'en'
                    ? 'Sign In with Authorized Google Email'
                    : 'Acceder con Correo Institucional / Gmail'}
                </span>
              </button>

              {loginError && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 flex items-start gap-2 text-rose-800 dark:text-rose-200 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white/80 dark:bg-slate-900 px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
                {language === 'en' ? 'or use PIN' : 'o mediante clave'}
              </span>
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            </div>

            {/* Option 2: Master Researcher PIN */}
            <form onSubmit={handlePinSubmit} className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'en'
                  ? 'Method 2: Researcher Master PIN'
                  : 'Opción 2: Clave Maestra de Investigador'}
              </label>

              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder={language === 'en' ? 'Enter researcher PIN' : 'Ingresa la clave secreta'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-base sm:text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <KeyRound className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
              </div>

              {pinError && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>
                    {language === 'en'
                      ? 'Invalid researcher PIN.'
                      : 'Clave incorrecta. Intenta de nuevo.'}
                  </span>
                </p>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-400 text-[11px]">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>
                    {language === 'en' ? 'Remember on this device' : 'Recordar en este navegador'}
                  </span>
                </label>

                <button
                  type="submit"
                  className="btn-aero-green px-5 py-2 rounded-full font-bold text-xs shadow-xs cursor-pointer"
                >
                  {language === 'en' ? 'Unlock' : 'Desbloquear'}
                </button>
              </div>
            </form>

            {/* Authorized Roles Footer Note */}
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                {language === 'en' ? 'Registered Researchers:' : 'Investigadores Registrados:'}
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-500 dark:text-cyan-200/70">
                <li>José Daniel Durango Caballero</li>
                <li>Jefersson Ramírez Oviedo</li>
                <li>Juan Carlos Giraldo Cardozo (Director)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
