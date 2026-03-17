import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  doc
} from "firebase/firestore";
import { db } from "../firebase/config";

// Hook for real-time matches
export const useMatches = (status = null) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = collection(db, "matches");
    if (status) {
      q = query(q, where("status", "==", status));
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const matchData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMatches(matchData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [status]);

  return { matches, loading };
};

// Hook for a single live match
export const useLiveMatch = (matchId) => {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) return;

    const unsubscribe = onSnapshot(doc(db, "matches", matchId), (doc) => {
      if (doc.exists()) {
        setMatch({ id: doc.id, ...doc.data() });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [matchId]);

  return { match, loading };
};

// Hook for tournaments
export const useTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = collection(db, "tournaments");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tournamentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTournaments(tournamentData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { tournaments, loading };
};
