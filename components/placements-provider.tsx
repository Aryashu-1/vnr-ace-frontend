
"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getJobListings, JobListing } from '@/lib/api';

interface PlacementsContextType {
    jobs: JobListing[];
    isLoading: boolean;
    refreshJobs: () => Promise<void>;
    getJobById: (id: string) => JobListing | undefined;
}

const PlacementsContext = createContext<PlacementsContextType | undefined>(undefined);

export function PlacementsProvider({ children }: { children: React.ReactNode }) {
    const [jobs, setJobs] = useState<JobListing[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshJobs = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getJobListings();
            setJobs(data);
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshJobs();
    }, [refreshJobs]);

    const getJobById = useCallback((id: string) => {
        return jobs.find(j => j.id === id);
    }, [jobs]);

    return (
        <PlacementsContext.Provider value={{ jobs, isLoading, refreshJobs, getJobById }}>
            {children}
        </PlacementsContext.Provider>
    );
}

export function usePlacements() {
    const context = useContext(PlacementsContext);
    if (context === undefined) {
        throw new Error('usePlacements must be used within a PlacementsProvider');
    }
    return context;
}
