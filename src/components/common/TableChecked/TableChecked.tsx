import {useEffect, useRef, useState} from 'react';

import {PropsTableChecked} from './interfaces';
import clsx from 'clsx';
import styles from './TableChecked.module.scss';

function TableChecked({data, column, fixedHeader = false, handleCheckedAll, isCheckedAll, handleCheckedRow, handleIsCheckedRow}: PropsTableChecked) {
	const myElementRef = useRef<any>(null);
	const [isShowScroll, setIsShowScroll] = useState<boolean>(false);

	const checkForHorizontalScroll = () => {
		const element = myElementRef.current;
		if (element.scrollWidth > element.clientWidth) {
			setIsShowScroll(true);
		} else {
			setIsShowScroll(false);
		}
	};

	useEffect(() => {
		// Check scroll on component mount
		checkForHorizontalScroll();

		// Set up resize event listener
		window.addEventListener('resize', checkForHorizontalScroll);

		return () => {
			window.removeEventListener('resize', checkForHorizontalScroll);
		};
	}, []);

	return (
		<div ref={myElementRef} className={clsx(styles.container, {[styles.fixedHeader]: fixedHeader})}>
			<table>
				<thead>
					<tr>
						{column.map((v: any, i: number) => (
							<th
								className={clsx(
									{
										[styles.checkBox]: v.checkBox,
										[styles.textEnd]: v.textAlign == 'end',
										[styles.textStart]: v.textAlign == 'start',
										[styles.textCenter]: v.textAlign == 'center',
										[styles.fixedLeft]: v.fixedLeft && isShowScroll,
										[styles.fixedRight]: v.fixedRight && isShowScroll,
									},
									styles.th_title
								)}
								key={i}
							>
								{v.checkBox ? (
									<input
										className={clsx(styles.checkbox, styles.checkbox_head)}
										onChange={(e) => {
											handleCheckedAll && handleCheckedAll(e);
										}}
										checked={isCheckedAll}
										type='checkbox'
									/>
								) : null}

								{v.title}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((v: any, i: number) => (
						<tr key={i} className={styles.tr_data}>
							{column.map((y: any, j: number) => (
								<td
									key={j}
									className={clsx({
										[styles.fixedLeft]: y.fixedLeft && isShowScroll,
										[styles.fixedRight]: y.fixedRight && isShowScroll,
									})}
								>
									<div
										className={clsx(y.className, {
											[styles.checkBox]: y.checkBox,
										})}
									>
										{y.checkBox ? (
											<input
												className={styles.checkbox}
												onChange={(e) => {
													handleCheckedRow && handleCheckedRow(e, v);
												}}
												checked={(handleIsCheckedRow && handleIsCheckedRow(v)) || v?.isChecked || false}
												type='checkbox'
											/>
										) : null}
										{y.render(v, i)}
									</div>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default TableChecked;
