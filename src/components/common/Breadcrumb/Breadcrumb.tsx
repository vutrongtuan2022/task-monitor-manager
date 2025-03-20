import React from 'react';

import {PropsBreadcrumb} from './interfaces';
import styles from './Breadcrumb.module.scss';
import Link from 'next/link';
import {IoIosArrowForward} from 'react-icons/io';
import clsx from 'clsx';

import {DocumentText1} from 'iconsax-react';

function Breadcrumb({listUrls, action}: PropsBreadcrumb) {
	return (
		<div className={clsx(styles.container)}>
			<div className={styles.main}>
				<div className={styles.breadcrumb}>
					<div className={styles.icon}>
						<DocumentText1 size={20} />
					</div>

					{listUrls?.map((v, i) => (
						<div key={i} className={styles.item}>
							<Link
								href={v.path}
								className={clsx(styles.link, {[styles.pathNow]: i == listUrls.length - 1})}
								onClick={(e) => (!v.path || i == listUrls.length - 1) && e.preventDefault()}
							>
								{v.title}
							</Link>
							{i != listUrls.length - 1 && <IoIosArrowForward color='#fff' />}
						</div>
					))}
				</div>
				{action}
			</div>
		</div>
	);
}

export default Breadcrumb;
