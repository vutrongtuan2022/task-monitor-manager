import Head from 'next/head';
import React, {Fragment} from 'react';

import {PATH} from '~/constants/config';

import styles from './Page502.module.scss';
import Button from '~/components/common/Button';
import ImageFill from '~/components/common/ImageFill';
import images from '~/constants/images/images';

function PageError() {
	return (
		<Fragment>
			<Head>
				<title>Page 502</title>
				<meta name='description' content='Page 502' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className={styles.container}>
				<div className={styles.box_image}>
					<ImageFill src={images.image502} className={styles.image} />
				</div>
				<h4 className={styles.title}>Oops! Lỗi máy chủ nội bộ..</h4>
				<p className={styles.text}>Xin lỗi! Hiện tại máy chủ đang gặp sự cố. Bạn vui lòng chờ trong giây lát hoặc thử lại sau.</p>
				<div className={styles.btn}>
					<Button href={PATH.Home} primary p_10_40 rounded_8 bold size_bold rps_small>
						Quay lại trang chủ
					</Button>
				</div>
			</div>
		</Fragment>
	);
}

export default PageError;
