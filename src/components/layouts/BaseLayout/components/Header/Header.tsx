import {ContextBaseLayout} from '../../BaseLayout';
import {PropsHeader} from './interfaces';
import TippyHeadless from '@tippyjs/react/headless';

import {TContextBaseLayout} from '../../interfaces';
import styles from './Header.module.scss';
import ImageFill from '~/components/common/ImageFill';
import icons from '~/constants/images/icons';
import {use, useContext, useEffect, useState} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/router';
import clsx from 'clsx';
import MenuTab from '../MenuTab';
import BoxMenuProfile from '../BoxMenuProfile';
import {useSelector} from 'react-redux';
import {RootState} from '~/redux/store';

function Header({isImport = false, isExport = false, title}: PropsHeader) {
	const router = useRouter();

	const {infoUser} = useSelector((state: RootState) => state.user);
	const context = useContext<TContextBaseLayout>(ContextBaseLayout);

	const [open, setOpen] = useState<boolean>(false);
	const [openProfile, setOpenProfile] = useState<boolean>(false);

	useEffect(() => {
		if (open) {
			document.body.style.overflowY = 'hidden';
		} else {
			document.body.style.overflowY = 'overlay';
		}
	}, [open]);

	useEffect(() => {
		if (open) {
			setOpen(false);
		}
	}, [router]);

	return (
		<div className={clsx(styles.container, {[styles.isAction]: isImport || isExport})}>
			<div className={styles.left}>
				<div className={styles.top}>
					<div className={styles.box_icon} onClick={() => context?.setShowFull!(!context?.showFull)}>
						<ImageFill src={icons.iconHum} alt='icon show hide' className={styles.icon} />
					</div>
					<div className={styles.box_icon_mobile} onClick={() => setOpen(true)}>
						<ImageFill src={icons.iconHum} alt='icon show hide' className={styles.icon} />
					</div>
					<h4 className={styles.title}>{title}</h4>
				</div>
				<div className={styles.main_action}>
					{isImport && (
						<div
							className={styles.btn}
							onClick={() =>
								router.replace({
									pathname: router.pathname,
									query: {
										...router.query,
										_action: 'import',
									},
								})
							}
						>
							<Image src={icons.iconAdd} alt='icon add' width={20} height={20} />
							<p>Nhập file</p>
						</div>
					)}
					{isExport && (
						<div
							className={styles.btn}
							onClick={() =>
								router.replace({
									pathname: router.pathname,
									query: {
										...router.query,
										_action: 'export',
									},
								})
							}
						>
							<Image src={icons.exportExcel} alt='icon down' width={20} height={20} />
							<p>Xuất file</p>
						</div>
					)}
				</div>
			</div>
			<div className={styles.right}>
				<div className={styles.box_noti}>
					<Image src={icons.bell} alt='icon bell' width={24} height={24} />
					<div className={styles.box_count}>
						<div className={styles.count}></div>
					</div>
				</div>

				<TippyHeadless
					maxWidth={'100%'}
					interactive
					visible={openProfile}
					onClickOutside={() => setOpenProfile(false)}
					placement='bottom-end'
					render={(attrs: any) => <BoxMenuProfile onClose={() => setOpenProfile(false)} />}
				>
					<div className={styles.box_infor} onClick={() => setOpenProfile(!openProfile)}>
						<p className={styles.name}>{infoUser?.fullname}</p>
						<div className={styles.box_avatar}>
							<Image src={icons.avatar} alt='avatar default' className={styles.avatar} layout='fill' />
						</div>
					</div>
				</TippyHeadless>
			</div>

			{/* Responsive mobile */}
			<div className={clsx(styles.overlay, {[styles.close]: !open})} onClick={() => setOpen(false)}></div>
			<div className={clsx(styles.main_mobile, {[styles.active]: open})}>
				<MenuTab />
			</div>
		</div>
	);
}

export default Header;
