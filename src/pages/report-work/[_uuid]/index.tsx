import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainDetailReportWork from '~/components/pages/report-work/MainDetailReportWork';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết báo cáo</title>
				<meta name='description' content='Chi tiết báo cáo' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainDetailReportWork />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chi tiết báo cáo'>{Page}</BaseLayout>;
};
