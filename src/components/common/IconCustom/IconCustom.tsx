import React from 'react';

import { PropsIconCustom } from './interfaces';
import styles from './IconCustom.module.scss';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import Link from 'next/link';

function IconCustom({ icon, tooltip, onClick, color, href, type, disnable = false }: PropsIconCustom) {
	return (
		<Tippy content={tooltip}>
			{href ? (
				<Link
					href={href}
					style={{ color: color }}
					className={clsx(
						{
							[styles.edit]: type == 'edit',
							[styles.create]: type == 'create',
							[styles.delete]: type == 'delete',
							[styles.view]: type == 'view',
							[styles.disnable]: disnable,
						},
						styles.container
					)}
					onClick={onClick}
				>
					<i>{icon}</i>
				</Link>
			) : (
				<div
					style={{ color: color }}
					className={clsx(
						{
							[styles.edit]: type == 'edit',
							[styles.create]: type == 'create',
							[styles.delete]: type == 'delete',
							[styles.view]: type == 'view',
							[styles.disnable]: disnable,
						},
						styles.container
					)}
					onClick={onClick}
				>
					<i>{icon}</i>
				</div>
			)}
		</Tippy>
	);
}

export default IconCustom;
