import React from 'react';

import {PropsDialog} from './interfaces';
import styles from './Dialog.module.scss';
import Popup from '../Popup';
import icons from '~/constants/images/icons';
import Image from 'next/image';
import Button from '../Button';
import {IoClose} from 'react-icons/io5';

function Dialog({
	open,
	title,
	note,
	icon = icons.question,
	titleCancel = 'Hủy bỏ',
	titleSubmit = 'Xác nhận',
	onClose,
	onSubmit,
	type = 'primary',
}: PropsDialog) {
	return (
		<Popup open={open} onClose={onClose}>
			<div className={styles.container}>
				<Image src={icon} alt='icon dialog' width={76} height={76} />
				<h4 className={styles.title}>{title}</h4>
				<p className={styles.note}>{note}</p>
				<div className={styles.groupBtn}>
					<Button grey_2 rounded_8 bold onClick={onClose} maxContent p_12_32 grey>
						{titleCancel}
					</Button>
					<Button
						bold
						rounded_8
						onClick={onSubmit}
						maxContent
						p_12_32
						primary={type == 'primary'}
						error={type == 'error'}
						warning={type == 'warning'}
					>
						{titleSubmit}
					</Button>
				</div>

				<div className={styles.close} onClick={onClose}>
					<IoClose size={28} color='#8492A6' />
				</div>
			</div>
		</Popup>
	);
}

export default Dialog;
