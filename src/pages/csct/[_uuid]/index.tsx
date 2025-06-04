import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageDetailCSCT from '~/components/pages/csct/MainPageDetailCSCT';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết CSCT thanh toán</title>
				<meta name='description' content='Chi tiết CSCT thanh toán' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageDetailCSCT />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chi tiết CSCT thanh toán'>{Page}</BaseLayout>;
};
