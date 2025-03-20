import {createContext} from 'react';
import {IFormForgotPassword} from '../interfaces';

export interface IContextForgotPassword {
	form: IFormForgotPassword | null;
	setForm: (any: any) => void;
	type: number | null;
	setType: (any: number) => void;
}

export const ContextForgotPassword = createContext<IContextForgotPassword>({
	form: null,
	setForm: () => null,
	type: null,
	setType: () => null,
});
