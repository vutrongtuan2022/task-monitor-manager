import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import DetailReportDisbursement from '~/components/pages/report-disbursement/DetailReportDisbursement';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết giải ngân</title>
				<meta name='description' content='Chi tiết giải ngân' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<DetailReportDisbursement />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chi tiết giải ngân'>{Page}</BaseLayout>;
};
