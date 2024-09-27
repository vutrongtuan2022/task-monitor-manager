import Head from 'next/head';
import React, {Fragment} from 'react';
import WrapperAuth from '~/components/layouts/WrapperAuth';
import MainForgotPassword from '~/components/pages/auth/MainForgotPassword';

export default function PageForgitPassword() {
	return (
		<Fragment>
			<Head>
				<title>Quên mật khẩu</title>
				<meta name='description' content='Quên mật khẩu' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperAuth>
				<MainForgotPassword />
			</WrapperAuth>
		</Fragment>
	);
}
