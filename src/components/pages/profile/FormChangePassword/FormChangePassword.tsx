import React, {useState} from 'react';

import {PropsFormChangePassword} from './interfaces';
import styles from './FormChangePassword.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import {httpRequest} from '~/services';
import {useMutation} from '@tanstack/react-query';
import {useSelector} from 'react-redux';
import md5 from 'md5';
import {RootState} from '~/redux/store';
import accountServices from '~/services/accountServices';
import {IoClose} from 'react-icons/io5';

function FormChangePassword({onClose}: PropsFormChangePassword) {
	const {infoUser} = useSelector((state: RootState) => state.user);

	const [form, setForm] = useState<{
		oldpassword: string;
		newpassword: string;
		confirmpassword: string;
	}>({oldpassword: '', newpassword: '', confirmpassword: ''});

	const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

	const funcChangePassword = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thay đổi mật khẩu thành công!',
				http: accountServices.changePassword({
					uuid: infoUser?.uuid as string,
					oldPassword: md5(`${form?.oldpassword}${process.env.NEXT_PUBLIC_KEY_PASS}`),
					newPassword: md5(`${form?.newpassword}${process.env.NEXT_PUBLIC_KEY_PASS}`),
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				setForm({
					oldpassword: '',
					newpassword: '',
					confirmpassword: '',
				});
			}
		},
		onError(error) {
			console.log({error});
		},
	});

	const handleSubmit = async () => {
		if (form.newpassword !== form.confirmpassword) {
			return toastWarn({msg: 'Mật khẩu mới không khớp'});
		}
		if (!regex.test(form?.newpassword)) {
			return toastWarn({
				msg: 'Mật khẩu mới phải chứa ít nhất 6 ký tự, bao gồm chữ cái và số',
			});
		}
		return funcChangePassword.mutate();
	};
	return (
		<div className={styles.container}>
			<Loading loading={funcChangePassword.isLoading} />
			<h4 className={styles.title}>Đổi mật khẩu</h4>
			{/* <p className={styles.des}>Mật khẩu mới bao gồm tối thiểu 6 ký tự gồm chữ hoa, chữ thường và số.</p> */}
			<div className={styles.form}>
				<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
					<Input
						type='password'
						name='oldpassword'
						value={form?.oldpassword}
						placeholder='Nhập mật khẩu cũ'
						onClean
						isRequired
						label={
							<span>
								Mật khẩu cũ <span style={{color: 'red'}}>*</span>
							</span>
						}
					/>

					<Input
						type='password'
						name='newpassword'
						value={form?.newpassword}
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
						name='confirmpassword'
						value={form?.confirmpassword}
						valueConfirm={form?.confirmpassword}
						placeholder='Nhập lại mật khẩu mới'
						onClean
						isRequired
						label={
							<span>
								Xác nhận mật khẩu mới <span style={{color: 'red'}}>*</span>
							</span>
						}
					/>

					<div className={styles.groupBtnPopup}>
						<div>
							<Button p_12_20 rounded_8 white_outline onClick={onClose} maxContent>
								Hủy bỏ
							</Button>
						</div>
						<div>
							<FormContext.Consumer>
								{({isDone}) => (
									<Button bold rounded_8 p_12_20 disable={!isDone}>
										Lưu lại
									</Button>
								)}
							</FormContext.Consumer>
						</div>
					</div>
					<div className={styles.close} onClick={onClose}>
						<IoClose />
					</div>
				</Form>
			</div>
		</div>
	);
}

export default FormChangePassword;
