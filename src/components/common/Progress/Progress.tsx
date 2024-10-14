import React from 'react';

import {PropsProgress} from './interfaces';
import styles from './Progress.module.scss';

function Progress({
	width,
	percent,
	isPercent = true,
	backgroundContainer = 'rgba(6, 215, 160, 0.2)',
	backgroundPercent = 'rgba(6, 215, 160, 1)',
}: PropsProgress) {
	return (
		<div className={styles.wrapper}>
			<div style={{width: width, background: backgroundContainer}} className={styles.container}>
				<div style={{width: (percent * width) / 100, background: backgroundPercent}} className={styles.percent}></div>
			</div>
			{isPercent && <p className={styles.text}>{percent} %</p>}
		</div>
	);
}

export default Progress;
