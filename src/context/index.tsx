/* eslint-disable @typescript-eslint/no-empty-function */
import React, {
	createContext,
	ReactElement,
	useContext,
	useState,
} from 'react';

interface GlobalContextProps {
	userId: string | undefined;
	setUserId: (userId: string | undefined) => void;
}
export const GlobalContext = createContext<GlobalContextProps>({
	userId: undefined,
	setUserId: (userId: string | undefined) => {},
});

interface Props {
	children?: ReactElement;
}

const GlobalProvider: React.FC<Props> = ({ children }: Props) => {
	const [userId, setUserId] = useState<string | undefined>(undefined);
	return (
		<GlobalContext.Provider
			value={{
				userId,
				setUserId,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};

export const useGlobalContext = () => useContext(GlobalContext);

export default GlobalProvider;
