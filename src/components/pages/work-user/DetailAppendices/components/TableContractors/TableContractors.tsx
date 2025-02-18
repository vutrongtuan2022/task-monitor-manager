import {useQuery} from '@tanstack/react-query';
import React from 'react';
import {QUERY_KEY, STATUS_CONFIG} from '~/constants/config/enum';

import {httpRequest} from '~/services';
import contractsServices from '~/services/contractsServices';
import {useRouter} from 'next/router';
import Pagination from '~/components/common/Pagination';
import styles from './TableContractors.module.scss';
import clsx from 'clsx';
import WrapperScrollbar from '~/components/layouts/WrapperScrollbar';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import Noti from '~/components/common/DataWrapper/components/Noti';
import {PropsTableContractor} from './interface';
import Moment from 'react-moment';

function TableContractors() {
	const router = useRouter();

	const {_uuid, _page, _pageSize, _keyword} = router.query;

	const {data: listContractor} = useQuery([QUERY_KEY.table_contractors_detail, _page, _pageSize, _uuid, _keyword], {
		queryFn: () =>
			httpRequest({
				http: contractsServices.detailPageListContractors({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 10,
					keyword: (_keyword as string) || '',
					status: STATUS_CONFIG.ACTIVE,
					uuid: _uuid as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_uuid,
	});
	return (
		<div className={clsx(styles.basic_info, styles.mt)}>
			<div className={styles.head}>
				<h4>Danh sách nhà thầu</h4>
			</div>
			<WrapperScrollbar>
				<DataWrapper
					data={listContractor?.items || []}
					loading={listContractor?.isLoading}
					noti={<Noti title='Danh sách nhà thầu trống!' des='Hiện tại chưa có thông tin nhà thầu nào!' />}
				>
					<Table
						fixedHeader={true}
						data={listContractor?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: PropsTableContractor, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Tên nhà thầu',
								render: (data: PropsTableContractor) => <p>{data?.contractorName}</p>,
							},
							{
								title: 'Thuộc nhóm nhà thầu',
								render: (data: PropsTableContractor) => <p>{data?.contractorCatName}</p>,
							},
							{
								title: 'Thời gian tạo',
								render: (data: PropsTableContractor) => (
									<>{data?.createDate ? <Moment date={data?.createDate} format='DD/MM/YYYY' /> : '---'}</>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 10}
					total={listContractor?.pagination?.totalCount}
					dependencies={[_pageSize, _uuid]}
				/>
			</WrapperScrollbar>
		</div>
	);
}

export default TableContractors;
