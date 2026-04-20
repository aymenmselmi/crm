import { create } from 'zustand';
import { CRMObject } from '../types';

interface NavStore {
  selectedObject: CRMObject | null;
  sidebarOpen: boolean;
  
  setSelectedObject: (obj: CRMObject | null) => void;
  toggleSidebar: () => void;
}

const objects: CRMObject[] = [
  { id: '1', name: 'Accounts', plural: 'Accounts', icon: 'Business', color: '#1f77d1' },
  { id: '2', name: 'Contact', plural: 'Contacts', icon: 'Person', color: '#39a7d8' },
  { id: '3', name: 'Lead', plural: 'Leads', icon: 'Flag', color: '#00b4d8' },
  { id: '4', name: 'Opportunity', plural: 'Opportunities', icon: 'TrendingUp', color: '#48cae4' },
  { id: '5', name: 'Activity', plural: 'Activities', icon: 'Event', color: '#90e0ef' },
];

const useNavStore = create<NavStore>((set) => ({
  selectedObject: objects[0],
  sidebarOpen: true,

  setSelectedObject: (obj) => set({ selectedObject: obj }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

export { objects };
export default useNavStore;
