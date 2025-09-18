import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimetableState, Class, Subject, Faculty, Room, Timetable, Conflict } from '@/types/timetable';

interface TimetableContextType {
  state: TimetableState;
  dispatch: React.Dispatch<TimetableAction>;
  saveTimetable: (timetable: Timetable) => Promise<void>;
  loadTimetable: (id: string) => Promise<Timetable | null>;
  exportTimetable: (timetable: Timetable) => Promise<string>;
  importTimetable: (data: string) => Promise<Timetable>;
}

type TimetableAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_CLASS'; payload: Class }
  | { type: 'UPDATE_CLASS'; payload: Class }
  | { type: 'DELETE_CLASS'; payload: string }
  | { type: 'SET_CLASSES'; payload: Class[] }
  | { type: 'ADD_SUBJECT'; payload: Subject }
  | { type: 'UPDATE_SUBJECT'; payload: Subject }
  | { type: 'DELETE_SUBJECT'; payload: string }
  | { type: 'SET_SUBJECTS'; payload: Subject[] }
  | { type: 'ADD_FACULTY'; payload: Faculty }
  | { type: 'UPDATE_FACULTY'; payload: Faculty }
  | { type: 'DELETE_FACULTY'; payload: string }
  | { type: 'SET_FACULTY'; payload: Faculty[] }
  | { type: 'ADD_ROOM'; payload: Room }
  | { type: 'UPDATE_ROOM'; payload: Room }
  | { type: 'DELETE_ROOM'; payload: string }
  | { type: 'SET_ROOMS'; payload: Room[] }
  | { type: 'SET_CURRENT_TIMETABLE'; payload: Timetable | null }
  | { type: 'SET_CONFLICTS'; payload: Conflict[] };

const initialState: TimetableState = {
  classes: [],
  subjects: [],
  faculty: [],
  rooms: [],
  currentTimetable: null,
  conflicts: [],
  isLoading: false,
  error: null,
};

function timetableReducer(state: TimetableState, action: TimetableAction): TimetableState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_CLASS':
      return { ...state, classes: [...state.classes, action.payload] };
    case 'UPDATE_CLASS':
      return {
        ...state,
        classes: state.classes.map(c => c.id === action.payload.id ? action.payload : c)
      };
    case 'DELETE_CLASS':
      return { ...state, classes: state.classes.filter(c => c.id !== action.payload) };
    case 'SET_CLASSES':
      return { ...state, classes: action.payload };
    case 'ADD_SUBJECT':
      return { ...state, subjects: [...state.subjects, action.payload] };
    case 'UPDATE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.map(s => s.id === action.payload.id ? action.payload : s)
      };
    case 'DELETE_SUBJECT':
      return { ...state, subjects: state.subjects.filter(s => s.id !== action.payload) };
    case 'SET_SUBJECTS':
      return { ...state, subjects: action.payload };
    case 'ADD_FACULTY':
      return { ...state, faculty: [...state.faculty, action.payload] };
    case 'UPDATE_FACULTY':
      return {
        ...state,
        faculty: state.faculty.map(f => f.id === action.payload.id ? action.payload : f)
      };
    case 'DELETE_FACULTY':
      return { ...state, faculty: state.faculty.filter(f => f.id !== action.payload) };
    case 'SET_FACULTY':
      return { ...state, faculty: action.payload };
    case 'ADD_ROOM':
      return { ...state, rooms: [...state.rooms, action.payload] };
    case 'UPDATE_ROOM':
      return {
        ...state,
        rooms: state.rooms.map(r => r.id === action.payload.id ? action.payload : r)
      };
    case 'DELETE_ROOM':
      return { ...state, rooms: state.rooms.filter(r => r.id !== action.payload) };
    case 'SET_ROOMS':
      return { ...state, rooms: action.payload };
    case 'SET_CURRENT_TIMETABLE':
      return { ...state, currentTimetable: action.payload };
    case 'SET_CONFLICTS':
      return { ...state, conflicts: action.payload };
    default:
      return state;
  }
}

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export function TimetableProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(timetableReducer, initialState);

  const saveTimetable = async (timetable: Timetable) => {
    try {
      const key = `timetable_${timetable.id}`;
      await AsyncStorage.setItem(key, JSON.stringify(timetable));
      // Also save to a list of timetables
      const savedTimetables = await AsyncStorage.getItem('saved_timetables') || '[]';
      const timetables = JSON.parse(savedTimetables);
      const updated = [...timetables.filter((t: Timetable) => t.id !== timetable.id), timetable];
      await AsyncStorage.setItem('saved_timetables', JSON.stringify(updated));
    } catch {
      throw new Error('Failed to save timetable');
    }
  };

  const loadTimetable = async (id: string): Promise<Timetable | null> => {
    try {
      const key = `timetable_${id}`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  const exportTimetable = async (timetable: Timetable): Promise<string> => {
    return JSON.stringify(timetable, null, 2);
  };

  const importTimetable = async (data: string): Promise<Timetable> => {
    try {
      const timetable = JSON.parse(data);
      if (!timetable.id || !timetable.title) {
        throw new Error('Invalid timetable data');
      }
      return timetable;
    } catch {
      throw new Error('Failed to import timetable');
    }
  };

  const value: TimetableContextType = {
    state,
    dispatch,
    saveTimetable,
    loadTimetable,
    exportTimetable,
    importTimetable,
  };

  return (
    <TimetableContext.Provider value={value}>
      {children}
    </TimetableContext.Provider>
  );
}

export function useTimetable() {
  const context = useContext(TimetableContext);
  if (context === undefined) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
}
