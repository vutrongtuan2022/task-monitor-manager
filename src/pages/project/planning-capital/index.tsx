import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPlanningCapital from '~/components/pages/project/MainPlanningCapital';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết dự án</title>
				<meta name='description' content='Chi tiết dự án' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPlanningCapital />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chi tiết dự án'>{Page}</BaseLayout>;
};
