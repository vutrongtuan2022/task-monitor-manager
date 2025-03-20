import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import CreateProject from '~/components/pages/project/CreateProject';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thêm mới dự án</title>
				<meta name='description' content='Thêm mới dự án' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<CreateProject />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Thêm mới dự án'>{Page}</BaseLayout>;
};
