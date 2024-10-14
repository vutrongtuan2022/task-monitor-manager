import {PropsBaseLayout, TContextBaseLayout} from './interfaces';
import {createContext, useState} from 'react';

import Header from './components/Header';
import MenuTab from './components/MenuTab';
import clsx from 'clsx';
import styles from './BaseLayout.module.scss';
import RequireAuth from '~/components/protected/RequiredAuth';

export const ContextBaseLayout = createContext<TContextBaseLayout>({});

function BaseLayout({children, title, isImport, isExport}: PropsBaseLayout) {
	const [showFull, setShowFull] = useState(true);

	return (
		<RequireAuth>
			<ContextBaseLayout.Provider value={{showFull, setShowFull}}>
				<div className={clsx(styles.container, {[styles.hidden]: !showFull})}>
					<div className={clsx(styles.tab)}>
						<MenuTab />
					</div>
					<div className={styles.wrapper}>
						<Header isImport={isImport} isExport={isExport} title={title} />
						<div className={styles.main}>{children}</div>
					</div>
				</div>
			</ContextBaseLayout.Provider>
		</RequireAuth>
	);
}

export default BaseLayout;
