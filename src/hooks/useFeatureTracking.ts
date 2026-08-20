import { useState, useEffect, useCallback } from 'react';
import { InteractionLog } from '../types';
import { authService } from '../services/authService';

const STORAGE_LOGS_KEY = 'kbox_feature_interaction_logs_v1';

const INITIAL_SEED_LOGS: InteractionLog[] = [
  {
    id: 'log-seed-1',
    feature: 'ROI Calculator',
    action: 'open',
    timestamp: new Date(Date.now() - 3600000 * 2).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    userRole: 'freemium',
    details: 'Simulación de 50M tokens vs On-Premises Capex'
  },
  {
    id: 'log-seed-2',
    feature: 'Community Hub',
    action: 'open',
    timestamp: new Date(Date.now() - 3600000 * 1.5).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    userRole: 'freemium',
    details: 'Consulta de White Papers y 7 Modelos de Monetización'
  },
  {
    id: 'log-seed-3',
    feature: 'Executive Dossier',
    action: 'export',
    timestamp: new Date(Date.now() - 3600000 * 0.8).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    userRole: 'admin',
    details: 'Generación y descarga de Dossier PDF Ejecutivo'
  }
];

export function useFeatureTracking() {
  const [interactionLogs, setInteractionLogs] = useState<InteractionLog[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_LOGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_SEED_LOGS;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(interactionLogs));
    } catch (e) {
      console.warn('Failed to persist interaction logs:', e);
    }
  }, [interactionLogs]);

  const logInteraction = useCallback((
    feature: string,
    action: 'open' | 'click' | 'export' | 'interact' | 'navigate' | 'unlock' = 'open',
    details?: string
  ) => {
    const currentUser = authService.getCurrentUser();
    const role = currentUser?.role || 'guest';
    const userIdentifier = currentUser ? (currentUser.name || currentUser.email || currentUser.phone || role) : 'guest';

    const newLog: InteractionLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      feature,
      action,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      userRole: `${role} (${userIdentifier})`,
      details: details || `Interacción con ${feature}`
    };

    setInteractionLogs(prev => [newLog, ...prev.slice(0, 99)]);
  }, []);

  const clearLogs = useCallback(() => {
    setInteractionLogs([]);
    try {
      localStorage.removeItem(STORAGE_LOGS_KEY);
    } catch {
      // ignore
    }
  }, []);

  return {
    interactionLogs,
    logInteraction,
    clearLogs
  };
}
