import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainDetailReportOverview from '~/components/pages/report-overview/MainDetailReportOverview';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết báo cáo tổng hợp</title>
				<meta name='description' content='Chi tiết báo cáo tổng hợp' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainDetailReportOverview />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chi tiết báo cáo tổng hợp'>{Page}</BaseLayout>;
};
