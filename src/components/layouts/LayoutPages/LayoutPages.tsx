import React, {useCallback} from 'react';

import {PropsLayoutPages} from './interfaces';
import styles from './LayoutPages.module.scss';
import Link from 'next/link';
import clsx from 'clsx';
import {useRouter} from 'next/router';

function LayoutPages({children, listPages, action}: PropsLayoutPages) {
	const router = useRouter();

	const checkActive = useCallback(
		(pathname: string) => {
			const path = pathname?.split('?')?.[0];

			const currentRoute = router.pathname;
			return path == `${currentRoute}`;
		},
		[router]
	);

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<div className={styles.listPages}>
					{listPages?.map((v, i) => (
						<Link key={i} href={v.path} className={clsx(styles.tab, {[styles.active]: checkActive(v.path)})}>
							{v.title}
						</Link>
					))}
				</div>
				{action}
			</div>
			<div className={styles.main}>{children}</div>
		</div>
	);
}

export default LayoutPages;
