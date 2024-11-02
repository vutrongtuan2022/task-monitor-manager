import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageProject from '~/components/pages/project/MainPageProject';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý dự án</title>
				<meta name='description' content='Quản lý dự án' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageProject />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý dự án'>{Page}</BaseLayout>;
};
