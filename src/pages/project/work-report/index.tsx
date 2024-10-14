import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainWorkReport from '~/components/pages/project/MainWorkReport';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết dự án</title>
				<meta name='description' content='Chi tiết dự án' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainWorkReport />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chi tiết dự án'>{Page}</BaseLayout>;
};
