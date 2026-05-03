
"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getJobListings, JobListing } from '@/lib/api';
import { DUMMY_JOBS } from '@/app/placements/application-portal/data';

interface PlacementsContextType {
    jobs: JobListing[];
    isLoading: boolean;
    refreshJobs: () => Promise<void>;
    getJobById: (id: string) => JobListing | undefined;
}

const PlacementsContext = createContext<PlacementsContextType | undefined>(undefined);

export function PlacementsProvider({ children }: { children: React.ReactNode }) {
    // Map DUMMY_JOBS to JobListing interface
    const mappedJobs: JobListing[] = DUMMY_JOBS.map(job => ({
        id: job.id,
        role: job.role,
        company_name: job.companyName,
        ctc: parseFloat(job.package.replace(/[^0-9.]/g, '')),
        external_registration_url: job.externalRegistrationUrl,
        requires_external_registration: job.requiresExternalRegistration || false,
        is_registered_externally: job.isRegisteredExternally || false,
        status: job.status?.toLowerCase() === 'applied' ? 'applied' : 'not_applied',
        location: job.location,
        deadline: job.deadline,
        tags: job.tags,
        description: job.description,
        criteria: job.criteria,
        skills: job.skills,
        examRounds: job.examRounds,
        instructions: job.instructions,
    }));

    const [jobs, setJobs] = useState<JobListing[]>(mappedJobs);
    const [isLoading, setIsLoading] = useState(false); // Set to false since we use static data

    const refreshJobs = useCallback(async () => {
        // Skip API call as requested
        console.log("Skipping DB call, using local state only.");
    }, []);

    useEffect(() => {
        // No need to fetch
    }, []);

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
