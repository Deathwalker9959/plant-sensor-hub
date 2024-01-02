import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { getAuth } from "firebase/auth";
import { useFirebase } from "./Firebase";
import { FirebaseApp } from "firebase/app";

export const UserContext = createContext<{
	user: any; // Specify a more accurate type if possible
	setUser: React.Dispatch<React.SetStateAction<any>>; // Adjust the type according to your user object
}>({
	user: null,
	setUser: () => {},
});

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
	children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
	const [user, setUser] = useState(null);
	const app: FirebaseApp = useFirebase()!;
	const auth = getAuth(app);

	useEffect(() => {
		const reloadUser = async () => {
			const user = await SecureStore.getItemAsync("user");
			if (user) {
				setUser(JSON.parse(user));
				await auth.updateCurrentUser(JSON.parse(user));
			}
		};
		reloadUser().catch(console.error);
	}, []);

	return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
