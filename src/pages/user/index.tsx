import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageUser from '~/components/pages/user/MainPageUser';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý nhân viên</title>
				<meta name='description' content='Quản lý nhân viên' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<MainPageUser />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý nhân viên'>{Page}</BaseLayout>;
};
