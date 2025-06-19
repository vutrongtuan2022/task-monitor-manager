import React from 'react';

import {ICSCT, PropsMainPageCSCT} from './interfaces';
import styles from './MainPageCSCT.module.scss';
import WrapperScrollbar from '~/components/layouts/WrapperScrollbar';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import IconCustom from '~/components/common/IconCustom';
import {Eye} from 'iconsax-react';
import FilterCustom from '~/components/common/FilterCustom';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_CONFIG, STATUS_CSCT} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Tippy from '@tippyjs/react';
import Search from '~/components/common/Search';
import projectServices from '~/services/projectServices';
import pnServices from '~/services/pnServices';
import Progress from '~/components/common/Progress';
import StateActive from '~/components/common/StateActive';
import Moment from 'react-moment';
import {PATH} from '~/constants/config';
import Link from 'next/link';

function MainPageCSCT({}: PropsMainPageCSCT) {
	const router = useRouter();
	const {_page, _pageSize, _keyword, _state, _project} = router.query;

	const {data: listProject} = useQuery([QUERY_KEY.dropdown_project], {
		queryFn: () =>
			httpRequest({
				http: projectServices.categoryProject({
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listPN = useQuery([QUERY_KEY.table_csct, _page, _pageSize, _keyword, _state, _project], {
		queryFn: () =>
			httpRequest({
				http: pnServices.listPN({
					pageSize: Number(_pageSize) || 10,
					page: Number(_page) || 1,
					keyword: (_keyword as string) || '',
					status: STATUS_CONFIG.ACTIVE,
					state: !!_state ? Number(_state) : null,
					projectUuid: (_project as string) || '',
				}),
			}),
		select(data) {
			return data;
		},
	});
	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo mã cấp số' />
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Trạng thái'
							query='_state'
							listFilter={[
								{
									id: STATUS_CSCT.NUMBER_ISSUED,
									name: 'CSCTTT đã cấp số',
								},
								{
									id: STATUS_CSCT.PENDING_APPROVAL,
									name: 'CSCTTT chờ phê duyệt',
								},
								{
									id: STATUS_CSCT.APPROVED,
									name: 'CSCTTT đã phê duyệt',
								},
								{
									id: STATUS_CSCT.REJECTED,
									name: 'CSCTTT bị từ chối',
								},
							]}
						/>
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Dự án'
							query='_project'
							listFilter={listProject?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>
					</div>
				</div>
				<div className={styles.btn}></div>
			</div>
			<WrapperScrollbar>
				<DataWrapper data={listPN?.data?.items || []} loading={listPN.isLoading} noti={<Noti />}>
					<Table
						fixedHeader={true}
						data={listPN?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: ICSCT, index: number) => <p>{index + 1}</p>,
							},
							{
								title: 'Mã cấp số',
								fixedLeft: true,
								render: (data: ICSCT, index: number) => (
									<Tippy content='Xem chi tiết'>
										<Link href={`${PATH.CSCT}/${data?.uuid}`} className={styles.link}>
											{data?.code || '---'}
										</Link>
									</Tippy>
								),
							},
							{
								title: 'Ngày lấy số',
								render: (data: ICSCT) => (
									<p>{data?.numberingDate ? <Moment date={data?.numberingDate} format='DD/MM/YYYY' /> : '---'}</p>
								),
							},
							{
								title: 'Tên dự án',
								render: (data: ICSCT) => <>{data?.project?.name || '---'}</>,
							},
							{
								title: 'SL hợp đồng',
								render: (data: ICSCT) => <p>{data?.totalContracts}</p>,
							},
							{
								title: 'Lãnh đạo phụ trách',
								render: (data: ICSCT) => <>{data?.project?.leader?.fullname || '---'}</>,
							},
							{
								title: 'Cán bộ chuyên quản',
								render: (data: ICSCT) => <>{data?.user?.fullname || '---'}</>,
							},
							{
								title: 'Tiến độ giải ngân',
								render: (data: ICSCT) => <Progress percent={data?.percent} width={80} />,
							},
							{
								title: 'Trạng thái',
								render: (data: ICSCT) => (
									<StateActive
										stateActive={data?.state}
										listState={[
											{
												state: STATUS_CSCT.NUMBER_ISSUED,
												text: 'CSCTTT đã cấp số',
												textColor: '#fff',
												backgroundColor: '#005994',
											},
											{
												state: STATUS_CSCT.PENDING_APPROVAL,
												text: 'CSCTTT chờ phê duyệt',
												textColor: '#fff',
												backgroundColor: '#FDAD73',
											},
											{
												state: STATUS_CSCT.APPROVED,
												text: 'CSCTTT đã phê duyệt',
												textColor: '#fff',
												backgroundColor: '#06D7A0',
											},
											{
												state: STATUS_CSCT.REJECTED,
												text: 'CSCTTT bị từ chối',
												textColor: '#fff',
												backgroundColor: '#EE464C',
											},
										]}
									/>
								),
							},
							{
								title: 'Hành động',
								fixedRight: true,
								render: (data: ICSCT) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<IconCustom
											href={`${PATH.CSCT}/${data?.uuid}`}
											type='edit'
											icon={<Eye fontSize={20} fontWeight={600} />}
											tooltip='Xem chi tiết'
										/>
									</div>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 10}
					total={listPN?.data?.pagination?.totalCount || 0}
					dependencies={[_pageSize, _keyword, _state, _project]}
				/>
			</WrapperScrollbar>
		</div>
	);
}

export default MainPageCSCT;
