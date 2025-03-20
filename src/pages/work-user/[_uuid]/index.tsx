import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import DetailPageWork from '~/components/pages/work-user/DetailPageWork';


export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết công việc và hợp đồng</title>
				<meta name='description' content='Chi tiết công việc và hợp đồng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<DetailPageWork />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chi tiết công việc và hợp đồng'>{Page}</BaseLayout>;
};
