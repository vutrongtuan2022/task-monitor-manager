import React, {useState} from 'react';

import {IFormForgotPassword, PropsMainForgotPassword} from './interfaces';
import styles from './MainForgotPassword.module.scss';
import {ContextForgotPassword} from './context';
import FormEmail from './components/FormEmail';
import FormOTP from './components/FormOTP';
import FormPassword from './components/FormPassword';
import clsx from 'clsx';

export enum TYPE_FORGOT_PASWORD {
	EMAIL = 1,
	OTP,
	PASSWORD,
}

function MainForgotPassword({}: PropsMainForgotPassword) {
	const [type, setType] = useState<TYPE_FORGOT_PASWORD>(TYPE_FORGOT_PASWORD.EMAIL);
	const [form, setFrom] = useState<IFormForgotPassword>({
		email: '',
		otp: '',
		password: '',
		rePassword: '',
	});

	return (
		<div className={clsx(styles.container, {[styles.formOTP]: type == TYPE_FORGOT_PASWORD.OTP})}>
			<ContextForgotPassword.Provider
				value={{
					form: form,
					setForm: setFrom,
					type: type,
					setType: setType,
				}}
			>
				{type == TYPE_FORGOT_PASWORD.EMAIL && <FormEmail />}
				{type == TYPE_FORGOT_PASWORD.OTP && <FormOTP />}
				{type == TYPE_FORGOT_PASWORD.PASSWORD && <FormPassword />}
			</ContextForgotPassword.Provider>
		</div>
	);
}

export default MainForgotPassword;
