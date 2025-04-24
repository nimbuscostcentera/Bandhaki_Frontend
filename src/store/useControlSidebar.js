import {create} from 'zustand';

// Define your store
const useControlSidebar = create((set) => ({
  Open:true, // Initial state
  CloseSideBarMenu: () => set({ Open: false }), // Action
  OpenSideBarMenu: () => set({ Open: true }), // Action
}));

export default useControlSidebar;
