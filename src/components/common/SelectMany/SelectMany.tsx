import React, {useEffect, useRef, useState} from 'react';
import TippyHeadless from '@tippyjs/react/headless';

import {PropsSelectMany} from './interfaces';
import styles from './SelectMany.module.scss';
import {AddCircle} from 'iconsax-react';
import clsx from 'clsx';
import {GrSearch} from 'react-icons/gr';
import {removeVietnameseTones} from '~/common/funcs/optionConvert';
import {IoClose} from 'react-icons/io5';

function SelectMany({label, placeholder, readOnly, isSearch = true, listData = [], value = [], setValue}: PropsSelectMany) {
	const ref = useRef<any>(null);

	const [open, setOpen] = useState<boolean>(false);
	const [width, setWidth] = useState<number>(0);
	const [keyword, setKeyword] = useState<string>('');

	useEffect(() => {
		if (ref.current) {
			const resizeObserver = new ResizeObserver((entries) => {
				if (entries[0].contentRect) {
					setWidth(entries[0].contentRect.width);
				}
			});

			resizeObserver.observe(ref.current);

			return () => {
				resizeObserver.disconnect();
			};
		}
	}, []);

	return (
		<TippyHeadless
			maxWidth={'100%'}
			interactive
			visible={open}
			onClickOutside={() => setOpen(false)}
			placement='bottom-start'
			render={() => (
				<div style={{width: width}} className={styles.containerOption}>
					{isSearch && (
						<div className={clsx(styles.search_group)}>
							<div className={styles.icon}>
								<GrSearch color='#005994' size={20} />
							</div>
							<input
								type='text'
								placeholder='Tìm kiếm...'
								onChange={(e) => setKeyword(e.target.value)}
								value={keyword}
								autoFocus={open}
							/>
						</div>
					)}
					<div className={styles.mainOption}>
						{listData
							?.filter((v) => removeVietnameseTones(v.title)?.includes(keyword ? removeVietnameseTones(keyword) : ''))
							?.map((v) => (
								<div
									key={v?.uuid}
									className={clsx(styles.option, {[styles.active]: !!value?.find((item) => v.uuid == item.uuid)})}
									onClick={() => setValue(v)}
								>
									{v?.title}
								</div>
							))}
					</div>
				</div>
			)}
		>
			<div ref={ref} className={styles.container}>
				{label ? <label className={styles.label}>{label}</label> : null}
				<div
					ref={ref}
					className={clsx(styles.select, {[styles.active]: open, [styles.readOnly]: readOnly})}
					onClick={() => {
						if (readOnly) {
							return null;
						} else {
							setOpen(!open);
						}
					}}
				>
					<div className={styles.value}>
						{value?.length == 0 ? (
							<p className={styles.placeholder}>{placeholder}</p>
						) : (
							value.map((v) => (
								<div
									key={v.uuid}
									className={styles.item}
									onClick={(e) => {
										e.stopPropagation();
									}}
								>
									<p>{v.title}</p>
									<div
										className={styles.close}
										onClick={() => {
											setValue(v);
										}}
									>
										<IoClose />
									</div>
								</div>
							))
						)}
					</div>
					<div className={styles.icon_add}>
						<AddCircle color='#3772FF' variant='Bold' />
					</div>
				</div>
			</div>
		</TippyHeadless>
	);
}

export default SelectMany;
