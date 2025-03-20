import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import DetailAppendices from '~/components/pages/work-user/DetailAppendices';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết phụ lục hợp đồng</title>
				<meta name='description' content='Chi tiết phụ lục hợp đồng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<DetailAppendices />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chi tiết phụ lục hợp đồng'>{Page}</BaseLayout>;
};
