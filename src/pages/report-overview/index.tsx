import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageReportOverview from '~/components/pages/report-overview/MainPageReportOverview';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Danh sách báo cáo tổng hợp</title>
				<meta name='description' content='Danh sách báo cáo tháng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageReportOverview />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout isExport={true} title='Danh sách báo cáo tổng hợp'>
			{Page}
		</BaseLayout>
	);
};
