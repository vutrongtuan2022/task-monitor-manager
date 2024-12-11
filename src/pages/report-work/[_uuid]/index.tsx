import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import DetailReportWork from '~/components/pages/report-work/DetailReportWork';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết kế hoạch tháng</title>
				<meta name='description' content='Chi tiết kế hoạch tháng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<DetailReportWork />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chi tiết kế hoạch tháng'>{Page}</BaseLayout>;
};
