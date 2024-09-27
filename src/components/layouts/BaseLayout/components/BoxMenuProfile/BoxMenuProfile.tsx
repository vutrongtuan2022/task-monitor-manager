import React, {useCallback, useState} from 'react';

import {PropsBoxMenuProfile} from './interfaces';
import styles from './BoxMenuProfile.module.scss';
import Link from 'next/link';
import {PATH} from '~/constants/config';
import {LogoutCurve, ShieldSecurity, UserOctagon} from 'iconsax-react';
import clsx from 'clsx';
import {useRouter} from 'next/router';
import {store} from '~/redux/store';
import {logout} from '~/redux/reducer/auth';
import {setInfoUser} from '~/redux/reducer/user';
import Dialog from '~/components/common/Dialog';
import icons from '~/constants/images/icons';
import {useMutation} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import authServices from '~/services/authServices';

function BoxMenuProfile({onClose}: PropsBoxMenuProfile) {
	const router = useRouter();

	const [openLogout, setOpenLogout] = useState<boolean>(false);

	const checkActive = useCallback(
		(pathname: string) => {
			const currentRoute = router.pathname.split('/')[1];
			return pathname == `/${currentRoute}`;
		},
		[router]
	);

	const fucnLogout = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: false,
				http: authServices.logout({}),
			}),
		onSuccess(data) {
			if (data) {
				store.dispatch(logout());
				store.dispatch(setInfoUser(null));
				router.push(PATH.Login);
			}
		},
	});

	const handleLogout = () => {
		return fucnLogout.mutate();
	};

	return (
		<div className={styles.container}>
			<Link href={PATH.Profile} className={clsx(styles.item, {[styles.active]: checkActive(PATH.Profile)})} onClick={onClose}>
				<UserOctagon size={20} className={styles.icon} />
				<div className={styles.box}>
					<p>Thông tin cá nhân</p>
					<p>Chi tiết tài khoản </p>
				</div>
			</Link>
			<div className={styles.line}></div>
			<Link
				href={PATH.ChangePassword}
				className={clsx(styles.item, {[styles.active]: checkActive(PATH.ChangePassword)})}
				onClick={onClose}
			>
				<ShieldSecurity size={20} className={styles.icon} />
				<div className={styles.box}>
					<p>Đổi mật khẩu</p>
					<p>Thay đổi mật khẩu</p>
				</div>
			</Link>
			<div className={styles.line}></div>
			<div
				className={clsx(styles.item, styles.logout)}
				onClick={() => {
					setOpenLogout(true);
					onClose();
				}}
			>
				<LogoutCurve size={20} className={styles.icon} />
				<div className={styles.box}>
					<p>Đăng xuất</p>
					<p>Đăng xuất khỏi hệ thống</p>
				</div>
			</div>

			<Dialog
				open={openLogout}
				onClose={() => setOpenLogout(false)}
				onSubmit={handleLogout}
				title='Đăng xuất'
				note='Bạn có muốn đăng xuất khỏi hệ thống không?'
				icon={icons.question}
				titleCancel='Không'
				titleSubmit='Đăng xuất'
				type='error'
			/>
		</div>
	);
}

export default BoxMenuProfile;
