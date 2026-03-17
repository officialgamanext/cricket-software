import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";
import { db } from "./config";

// Teams API
export const getTeams = async () => {
  const querySnapshot = await getDocs(collection(db, "teams"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addTeam = async (teamData) => {
  return await addDoc(collection(db, "teams"), teamData);
};

// Matches API
export const getMatches = async (tournamentId = null) => {
  let q = collection(db, "matches");
  if (tournamentId) {
    q = query(q, where("tournamentId", "==", tournamentId));
  }
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateMatchScore = async (matchId, scoreData) => {
  const matchRef = doc(db, "matches", matchId);
  return await updateDoc(matchRef, { scores: scoreData });
};

// Tournaments API
export const getTournaments = async () => {
  const querySnapshot = await getDocs(collection(db, "tournaments"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
