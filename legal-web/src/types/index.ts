export interface Contratto { id: string; tipo: number; titolo: string; descrizione?: string; controParte?: string; valore?: number; stato: number; createdAt: string; }
export interface ProprietaIntellettuale { id: string; tipo: number; titolo: string; stato: number; createdAt: string; }
export interface Scadenza { id: string; tipo: number; titolo: string; dataScadenza: string; priorita: number; stato: number; }
export interface Adempimento { id: string; normativa?: string; titolo: string; tipo: number; stato: number; }
export interface CasoContenzioso { id: string; tipo: number; titolo: string; controParte?: string; stato: number; }
