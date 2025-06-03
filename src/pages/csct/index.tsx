import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageCSCT from '~/components/pages/csct/MainPageCSCT';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Danh sách CSCT thanh toán</title>
				<meta name='description' content='Danh sách CSCT thanh toán' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageCSCT />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Danh sách CSCT thanh toán'>{Page}</BaseLayout>;
};
