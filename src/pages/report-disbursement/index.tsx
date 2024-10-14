import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageReportDisbursement from '~/components/pages/report-disbursement/MainPageReportDisbursement';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Báo cáo giải ngân</title>
				<meta name='description' content='Báo cáo giải ngân' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageReportDisbursement />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Báo cáo giải ngân'>{Page}</BaseLayout>;
};
