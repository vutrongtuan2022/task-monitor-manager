import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageWorkUser from '~/components/pages/work-user/MainPageWorkUser';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Công việc nhân viên</title>
				<meta name='description' content='Công việc nhân viên' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageWorkUser />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Công việc nhân viên'>{Page}</BaseLayout>;
};
