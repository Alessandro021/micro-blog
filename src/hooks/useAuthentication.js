import {db} from "../firebase/confing";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut} from "firebase/auth";
import { useState, useEffect } from "react";

export const useAuthentication = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    //lidar com vazamento de memória

    const [cancelled, setCancelled] = useState(false);
    const auth = getAuth();
    //CLEANUP
    const checkIfISCancelled = () => {
        if(cancelled) return;
    };

    const createUser = async (data) => {
        checkIfISCancelled();

        setLoading(true);
        setError(null);

        try {
            const {user} = await createUserWithEmailAndPassword( auth, data.email, data.password );
            await updateProfile(user, {displayName: data.displayName});
            setLoading(false);

            return user;
        } catch (error) {
            console.log(error.message);
            console.log(typeof error.message);

            let systemErrorMessage;
            if(error.message.includes("password")){
                systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres!";
            } else if(error.message.includes("email-already")){
                systemErrorMessage = "Email já cadastarado.";
            } else {
                systemErrorMessage = "Ocorreu um error inesperado!";
            }
            
            setLoading(false);
            setError(systemErrorMessage);
        }
    };

    const logout = () => {
        checkIfISCancelled();
        signOut(auth);
    };

    const login = async (data) => {
        checkIfISCancelled();
        setLoading(true);
        setError(false);

        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            setLoading(false);
        } catch (error) {
            console.log(error.message);
            console.log(typeof error.message);

            let systemErrorMessage;
            if(error.message.includes("user-not-found")) {
                systemErrorMessage = "Usuario não encontrado.";
            } else if(error.message.includes("wrong-password")) {
                systemErrorMessage = "Senha incorreta.";
            } else {
                systemErrorMessage = "Ocorreu um error inesperado!";
            }
            
            setLoading(false);
            setError(systemErrorMessage);
        }
    };

    useEffect(() => {
        return () => setCancelled(true);
    },[]);

    return { auth, createUser, error, loading, logout, login};
};