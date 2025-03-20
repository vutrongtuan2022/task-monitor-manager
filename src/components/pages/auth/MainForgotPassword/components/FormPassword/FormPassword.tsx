import React, {useContext, useState} from 'react';

import {PropsFormPassword} from './interfaces';
import styles from './FormPassword.module.scss';
import {ContextForgotPassword, IContextForgotPassword} from '../../context';
import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import Popup from '~/components/common/Popup';
import FormSusses from '../FormSusses';
import {useRouter} from 'next/router';
import {useMutation} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import accountServices from '~/services/accountServices';
import md5 from 'md5';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';

function FormPassword({}: PropsFormPassword) {
	const router = useRouter();

	const {open, ...rest} = router.query;

	const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

	const context = useContext<IContextForgotPassword>(ContextForgotPassword);

	const [openSusses, setOpenSusses] = useState<boolean>(false);
	// Đổi mật khẩu
	const funcChangePassForget = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Lấy lại mật khẩu thành công!',
				http: accountServices.changePassForget({
					email: context?.form?.email!,
					otp: context?.form?.otp!,
					newPass: md5(`${context?.form?.password}${process.env.NEXT_PUBLIC_KEY_PASS}`),
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenSusses(true);
			}
		},
	});
	const handleSubmit = () => {
		if (!regex.test(context?.form?.password!)) {
			return toastWarn({
				msg: 'Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm chữ cái và số',
			});
		}

		return funcChangePassForget.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcChangePassForget.isLoading} />
			<h4 className={styles.title}>THIẾT LẬP MẬT KHẨU</h4>
			<p className={styles.des}>Mật khẩu mới bao gồm tối thiểu 6 ký tự gồm chữ hoa, chữ thường và số.</p>
			<div className={styles.form}>
				<Form form={context.form} setForm={context.setForm} onSubmit={handleSubmit}>
					<Input
						type='password'
						name='password'
						value={context?.form?.password}
						placeholder='Nhập mật khẩu mới'
						onClean
						isRequired
						label={
							<span>
								Mật khẩu mới <span style={{color: 'red'}}>*</span>
							</span>
						}
					/>

					<Input
						type='password'
						name='rePassword'
						value={context?.form?.rePassword}
						valueConfirm={context?.form?.password}
						placeholder='Nhập lại mật khẩu'
						onClean
						isRequired
						label={
							<span>
								Xác nhận mật khẩu mới <span style={{color: 'red'}}>*</span>
							</span>
						}
					/>

					<div className={styles.btn}>
						<FormContext.Consumer>
							{({isDone}) => (
								<Button primaryLinear bold rounded_8 disable={!isDone}>
									Lưu mật khẩu
								</Button>
							)}
						</FormContext.Consumer>
					</div>
				</Form>
			</div>

			<Popup open={openSusses} onClose={() => setOpenSusses(false)}>
				<FormSusses />
			</Popup>
		</div>
	);
}

export default FormPassword;
