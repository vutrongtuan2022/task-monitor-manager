import React from 'react';

import {PropsWrapperScrollbar} from './interfaces';
import styles from './WrapperScrollbar.module.scss';
import clsx from 'clsx';

function WrapperScrollbar({isWrappreTable = true, children}: PropsWrapperScrollbar) {
	return <div className={clsx(styles.container, {[styles.isWrappreTable]: isWrappreTable})}>{children}</div>;
}

export default WrapperScrollbar;
