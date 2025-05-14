'use client'
import { createClient } from '@/lib/supabase'
import { Session, User } from '@supabase/supabase-js'
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'


type SessionContextType = {
    session: Session | null;
    user: User | null;
    loading: boolean;
};


const SessionContext = createContext<SessionContextType | undefined>(undefined)

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const supabase = createClient()

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession()

            if (error) {
                console.log(`Error fectching session : ${error}`)
            }

            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        }
        fetchSession()

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)

        })

        return listener.subscription.unsubscribe()
    }, [])

    console.log(session, user)
    return (
        <SessionContext.Provider value={{ user, session, loading }}>
            {children}
        </SessionContext.Provider>
    );


}

export const useSessionContext = () => {
    const context = useContext(SessionContext)
    if (!context) throw new Error("useSessionContext must be used within a SessionProvider")
    return context
}