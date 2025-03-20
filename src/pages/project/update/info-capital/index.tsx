import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import UpdateInfoCapital from '~/components/pages/project/UpdateInfoCapital';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chỉnh sửa dự án</title>
				<meta name='description' content='Chỉnh sửa dự án' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<UpdateInfoCapital />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chỉnh sửa dự án'>{Page}</BaseLayout>;
};
