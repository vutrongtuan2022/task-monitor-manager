import Head from 'next/head';
import React, {Fragment} from 'react';

import {PATH} from '~/constants/config';

import styles from './Page404.module.scss';
import ImageFill from '~/components/common/ImageFill';
import images from '~/constants/images/images';
import Button from '~/components/common/Button';

function PageNotFound() {
	return (
		<Fragment>
			<Head>
				<title>Page 404</title>
				<meta name='description' content='Page 404' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className={styles.container}>
				<div className={styles.box_image}>
					<ImageFill src={images.image404} className={styles.image} />
				</div>
				<h4 className={styles.title}>RẤT TIẾC ! TRANG BẠN TÌM KIẾM KHÔNG TỒN TẠI.</h4>
				<p className={styles.text}>Bạn vui lòng quay lại trang chủ để có thể khám phá thêm những chức năng hấp dẫn.</p>
				<div className={styles.btn}>
					<Button href={PATH.Home} primary p_10_40 rounded_8 bold size_bold rps_small>
						Quay lại trang chủ
					</Button>
				</div>
			</div>
		</Fragment>
	);
}

export default PageNotFound;
