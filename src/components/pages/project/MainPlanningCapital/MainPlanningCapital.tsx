import React, {useState} from 'react';

import {PropsMainPlanningCapital} from './interfaces';
import styles from './MainPlanningCapital.module.scss';
import LayoutPages from '~/components/layouts/LayoutPages';
import {PATH} from '~/constants/config';
import {useRouter} from 'next/router';
import Button from '~/components/common/Button';
import GridColumn from '~/components/layouts/GridColumn';
import StateActive from '~/components/common/StateActive';
import {QUERY_KEY, STATE_PROJECT} from '~/constants/config/enum';
import Progress from '~/components/common/Progress';
import Moment from 'react-moment';
import clsx from 'clsx';
import {httpRequest} from '~/services';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {convertCoin} from '~/common/funcs/convertCoin';
import Dialog from '~/components/common/Dialog';
import Loading from '~/components/common/Loading';
import Breadcrumb from '~/components/common/Breadcrumb';
import icons from '~/constants/images/icons';
import WrapperScrollbar from '~/components/layouts/WrapperScrollbar';
import projectServices from '~/services/projectServices';
import Tippy from '@tippyjs/react';

function MainPlanningCapital({}: PropsMainPlanningCapital) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuid} = router.query;

	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						path: PATH.Project,
						title: 'Danh sách dự án',
					},
					{
						path: '',
						title: 'Nhật ký kế hoạch vốn',
					},
				]}
			/>
			<LayoutPages
				listPages={[
					{
						title: 'Thông tin chung',
						path: `${PATH.ProjectInfo}?_uuid=${_uuid}`,
					},
					{
						title: 'Quản lý công việc',
						path: `${PATH.ProjectWorkReport}?_uuid=${_uuid}`,
					},
					{
						title: 'Quản lý hợp đồng',
						path: `${PATH.ProjectDisbursementProgress}?_uuid=${_uuid}`,
					},
					{
						title: 'Quản lý nhà thầu',
						path: `${PATH.ProjectContractor}?_uuid=${_uuid}`,
					},
					{
						title: 'Nhật ký kế hoạch vốn',
						path: `${PATH.ProjectPlanningCapital}?_uuid=${_uuid}`,
					},
				]}
				// action={
				// 	<div className={styles.group_btn}>
				// 		{detailProject?.state == STATE_PROJECT.PREPARE && (
				// 			<Button p_14_24 rounded_8 blueLinear onClick={() => setOpenStart(true)}>
				// 				Thực hiện dự án
				// 			</Button>
				// 		)}
				// 		{detailProject?.state == STATE_PROJECT.DO && (
				// 			<Button p_14_24 rounded_8 primary onClick={() => setOpenFinish(true)}>
				// 				Kết thúc dự án
				// 			</Button>
				// 		)}
				// 		{detailProject?.state == STATE_PROJECT.PREPARE && (
				// 			<Button p_14_24 rounded_8 light-red onClick={() => setOpenDelete(true)}>
				// 				Xóa
				// 			</Button>
				// 		)}
				// 		{detailProject?.state != STATE_PROJECT.FINISH && (
				// 			<Button p_14_24 rounded_8 primaryLinear href={`${PATH.UpdateInfoProject}?_uuid=${_uuid}`}>
				// 				Chỉnh sửa
				// 			</Button>
				// 		)}
				// 		{detailProject?.state == STATE_PROJECT.FINISH && (
				// 			<Button p_14_24 rounded_8 blueLinear onClick={() => setOpenReStart(true)}>
				// 				Tái hoạt động dự án
				// 			</Button>
				// 		)}
				// 	</div>
				// }
			>
				<WrapperScrollbar isWrappreTable={false}>
					<div>Nhật ký kế hoạch vốn</div>
				</WrapperScrollbar>
			</LayoutPages>
		</div>
	);
}

export default MainPlanningCapital;
