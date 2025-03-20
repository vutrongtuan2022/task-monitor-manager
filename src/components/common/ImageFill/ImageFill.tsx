'use client';

import clsx from 'clsx';
import styles from './ImageFill.module.scss';
import {useStyleClass} from '~/common/hooks/usStyleClass';
import ImageWithFallback from './components/ImageWithFallback';

function ImageFill({src, className, ...props}: {src: any; className?: string; [props: string]: any}) {
	const styleClass = useStyleClass(props, styles);

	return (
		<div className={styles.container}>
			<div className={clsx(styles.main, className, styleClass)}>
				<ImageWithFallback src={src} layout='fill' alt={props.alt || 'task-monitor-admin'} {...props} />
			</div>
		</div>
	);
}

export default ImageFill;
