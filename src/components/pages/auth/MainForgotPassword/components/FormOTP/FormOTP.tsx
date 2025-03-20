import React, {useContext, useEffect, useState} from 'react';

import {PropsFormOTP} from './interfaces';
import styles from './FormOTP.module.scss';
import InputSingle from '~/components/common/InputSingle';
import {ContextForgotPassword, IContextForgotPassword} from '../../context';
import Button from '~/components/common/Button';
import {TYPE_FORGOT_PASWORD} from '../../MainForgotPassword';
import {IoClose} from 'react-icons/io5';
import {useMutation} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import accountServices from '~/services/accountServices';
import Loading from '~/components/common/Loading';
import {obfuscateEmail} from '~/common/funcs/optionConvert';
import fancyTimeFormat from '~/common/funcs/fancyTimeFormat';

function FormOTP({}: PropsFormOTP) {
	const TIME_OTP = 60;

	const context = useContext<IContextForgotPassword>(ContextForgotPassword);

	const [countDown, setCoutDown] = useState<number>(TIME_OTP);

	useEffect(() => {
		if (countDown > 0) {
			const time = setTimeout(() => {
				setCoutDown(countDown - 1);
			}, 1000);
			return () => clearInterval(time);
		}
	}, [countDown]);

	//Gửi lại OTP
	const funcSendOTP = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'OTP đã được gửi về email của bạn!',
				http: accountServices.sendOTP({email: context?.form?.email!}),
			});
		},
		onSuccess(data) {
			if (data) {
				setCoutDown(TIME_OTP);
			}
		},
	});

	//fuc submit otp
	const funcSubmitOTP = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xác thực OTP thành công!',
				http: accountServices.enterOTP({
					email: context?.form?.email!,
					otp: context?.form?.otp!,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				context.setType(TYPE_FORGOT_PASWORD.PASSWORD);
			}
		},
	});

	const handleSubmit = () => {
		return funcSubmitOTP.mutate();
	};

	const handleSendcode = () => {
		return funcSendOTP.mutate();
	};

	const handleClose = () => {
		context.setType(TYPE_FORGOT_PASWORD.EMAIL);
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcSendOTP.isLoading || funcSubmitOTP.isLoading} />
			<h4 className={styles.title}>Xác thực mã OTP</h4>
			<p className={styles.des}>
				Một mã xác thực đã được gửi cho bạn qua địa chỉ email: <span>{obfuscateEmail(context?.form?.email!)}</span>
			</p>
			<div className={styles.form}>
				<p className={styles.text_otp}>Nhập mã OTP</p>
				<div className={styles.box_code}>
					<InputSingle onSetValue={context.setForm} name='otp' lenght={6} />
				</div>
				<p className={styles.countDown}>
					Bạn chưa nhận được mã.
					{countDown > 0 ? (
						<span className={styles.textGreen}>Gửi lại OTP ({fancyTimeFormat(countDown)})</span>
					) : (
						<span className={styles.textGreen} onClick={handleSendcode}>
							Gửi lại OTP
						</span>
					)}
				</p>
				<div className={styles.btn}>
					<Button primaryLinear bold rounded_8 disable={context?.form?.otp?.length! < 6} onClick={handleSubmit}>
						Xác thực Email
					</Button>
				</div>
			</div>

			<div className={styles.close} onClick={handleClose}>
				<IoClose size={24} />
			</div>
		</div>
	);
}

export default FormOTP;
