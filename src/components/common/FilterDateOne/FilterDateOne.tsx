import clsx from 'clsx';
import styles from './FilterDateOne.module.scss';
import {PropsFilterDateOne} from './interfaces';
import {memo, useState} from 'react';
import {IoIosArrowDown} from 'react-icons/io';
import HeadlessTippy from '@tippyjs/react/headless';
import Calendar from '../DatePicker/components/Calendar';
import Moment from 'react-moment';
import {RiCloseCircleFill} from 'react-icons/ri';
import Button from '../Button';
import {RefreshRightSquare, Trash} from 'iconsax-react';

function FilterDateOne({title, date, styleRounded, onSetDate}: PropsFilterDateOne) {
	const [openDate, setOpenDate] = useState<boolean>(false);

	const handleClickDay = (time: number) => {
		setOpenDate(false);
		const date = new Date(time);
		onSetDate(date);
	};

	const handleClean = (e: any) => {
		e.stopPropagation();
		onSetDate(null);
	};

	const normalizedDate = new Date(date!);
	normalizedDate.setHours(0, 0, 0, 0);

	const timestamp = normalizedDate.getTime();
	return (
		<HeadlessTippy
			interactive
			visible={openDate}
			placement='bottom'
			render={(attrs) => (
				<div className={styles.calendarContainer}>
					<Calendar onClickDay={handleClickDay} show={openDate} value={timestamp ? new Date(timestamp).getTime() : undefined} />
					<Button p_10_24 rounded_8 primary onClick={handleClean}>
						đặt lại
					</Button>
					{/* <div className={styles.delete} onClick={() => handleClean}>
						<RefreshRightSquare color='#005994' />
					</div> */}
				</div>
			)}
			onClickOutside={() => setOpenDate(false)}
		>
			<div
				className={clsx(styles.container, {[styles.styleRounded]: styleRounded, [styles.active]: openDate})}
				onClick={() => setOpenDate(!openDate)}
			>
				<div className={styles.value}>
					<p className={styles.name}>{title}:</p>
					<p className={styles.text}>
						<span>{date ? <Moment date={date!} format='DD/MM/YYYY' /> : 'Tất cả'}</span>
					</p>
				</div>
				<div>
					<div className={styles.icon_arrow}>
						<IoIosArrowDown size={16} />
					</div>
				</div>
			</div>
		</HeadlessTippy>
	);
}

export default FilterDateOne;
