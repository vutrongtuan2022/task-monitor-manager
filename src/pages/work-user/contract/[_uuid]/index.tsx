import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import DetailContractWork from '~/components/pages/work-user/DetailContractWork';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết hợp đồng</title>
				<meta name='description' content='Chi tiết hợp đồng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<DetailContractWork />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chi tiết hợp đồng'>{Page}</BaseLayout>;
};
