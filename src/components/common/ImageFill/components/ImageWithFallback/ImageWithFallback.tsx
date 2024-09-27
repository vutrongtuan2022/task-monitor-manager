'use client';

import React, {useEffect, useState} from 'react';

import Image from 'next/legacy/image';
import styles from './ImageWithFallback.module.scss';
import images from '~/constants/images/images';

const ImageWithFallback = (props: any) => {
	const {src, fallbackSrc, alt, ...rest} = props;
	const [imgSrc, setImgSrc] = useState(src);

	useEffect(() => {
		setImgSrc(src);
	}, [src]);

	return (
		<Image
			className={styles.image}
			{...rest}
			src={imgSrc}
			onError={() => {
				setImgSrc(fallbackSrc || images.placeholder);
			}}
			alt={alt || 'Image With Fallback'}
		/>
	);
};

export default ImageWithFallback;
