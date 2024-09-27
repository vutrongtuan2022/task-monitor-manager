import React from 'react';

import {PropsWrapperScrollbar} from './interfaces';
import styles from './WrapperScrollbar.module.scss';

function WrapperScrollbar({children}: PropsWrapperScrollbar) {
	return <div className={styles.container}>{children}</div>;
}

export default WrapperScrollbar;
