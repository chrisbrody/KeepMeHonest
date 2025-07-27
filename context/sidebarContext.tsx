// context/SidebarContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SidebarContextType {
    isOpen: boolean;
    toggleSidebar: () => void;
    openSidebar: () => void;
    closeSidebar: () => void;
}

// Create context with a default value (can be undefined or null initially)
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Create a provider component
export const SidebarProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const openSidebar = () => setIsOpen(true);
    const closeSidebar = () => setIsOpen(false);

    return (
        <SidebarContext.Provider value={{ isOpen, toggleSidebar, openSidebar, closeSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};

// Create a custom hook to use the context easily
export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};