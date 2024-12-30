import React, {useState} from 'react';
import styles from './DetailPageWork.module.scss';
import {IContractByActivity, IDetailActivityContract, PropsDetailPageWork} from './interface';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import StateActive from '~/components/common/StateActive';
import {QUERY_KEY, STATE_CONTRACT_WORK, STATUS_CONFIG} from '~/constants/config/enum';
import GridColumn from '~/components/layouts/GridColumn';
import {clsx} from 'clsx';
import WrapperScrollbar from '~/components/layouts/WrapperScrollbar';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Tippy from '@tippyjs/react';
import Link from 'next/link';
import {convertCoin} from '~/common/funcs/convertCoin';
import Moment from 'react-moment';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import activityServices from '~/services/activityServices';
import contractsServices from '~/services/contractsServices';

function DetailPageWork({}: PropsDetailPageWork) {
	const router = useRouter();

	const {_page, _pageSize, _uuid} = router.query;



	const {data: detailActivityContract} = useQuery<IDetailActivityContract>([QUERY_KEY.detail_activity_contract, _uuid], {
		queryFn: () =>
			httpRequest({
				http: activityServices.getDetailActivityContract({
					uuid: _uuid as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_uuid,
	});

	const {data: listContractByActivity} = useQuery([QUERY_KEY.table_contract_by_activity, _page, _pageSize, _uuid], {
		queryFn: () =>
			httpRequest({
				http: contractsServices.listContractsByActivity({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 10,
					keyword: '',
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
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						path: PATH.WorkUser,
						title: 'Danh sách công việc cần làm',
					},
					{
						path: '',
						title: 'Chi tiết công việc',
					},
				]}
				
			/>
			<div className={styles.main}>
				<div className={styles.basic_info}>
					<div className={styles.head}>
						<h4>Thông tin cơ bản</h4>
					</div>
					<div className={styles.progress_group}>
						<GridColumn col_3>
							<div className={styles.item}>
								<p>Tên công trình</p>
								<p>{detailActivityContract?.project?.name || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Tên công việc</p>
								<p>{detailActivityContract?.name || '---'}</p>
							</div>
						</GridColumn>
					</div>
				</div>
				<div className={clsx(styles.basic_info, styles.mt)}>
					<div className={styles.head}>
						<h4>Lịch sử hợp đồng công việc</h4>
					</div>
					<WrapperScrollbar>
						<DataWrapper
							data={listContractByActivity?.items || []}
							loading={listContractByActivity?.isLoading}
							noti={<Noti title='Danh sách hợp đồng trống!' des='Hiện tại chưa có hợp đồng nào!' />}
						>
							<Table
								fixedHeader={true}
								data={listContractByActivity?.items || []}
								column={[
									{
										title: 'STT',
										render: (data: IContractByActivity, index: number) => <>{index + 1}</>,
									},
									{
										title: 'Số hợp đồng',
										fixedLeft: true,
										render: (data: IContractByActivity) => (
											<Tippy content='Chi tiết hợp đồng'>
												<Link
													href={`${PATH.ContractWork}/${data?.uuid}?_uuidWork=${_uuid}`}
													className={styles.link}
												>
													{data?.code}
												</Link>
											</Tippy>
										),
									},
									{
										title: 'Giá trị hợp đồng (VND)',
										render: (data: IContractByActivity) => <>{convertCoin(data?.amount)}</>,
									},
									{
										title: 'Ngày ký hợp đồng',
										render: (data: IContractByActivity) => (
											<>{data?.startDate ? <Moment date={data?.startDate} format='DD/MM/YYYY' /> : '---'}</>
										),
									},
									{
										title: 'Ngày THHĐ',
										render: (data: IContractByActivity) => <>{data?.totalDayAdvantage}</>,
									},
									{
										title: 'Nhóm nhà  thầu',
										render: (data: IContractByActivity) => <>{data?.contractor?.contractorCat?.name}</>,
									},
									{
										title: 'Tên nhà thầu',
										render: (data: IContractByActivity) => <>{data?.contractor?.name}</>,
									},
									
									{
										title: 'Giá trị BLTHHĐ (VND) ',
										render: (data: IContractByActivity) => <>{convertCoin(data?.contractExecution?.amount)}</>,
									},
									{
										title: 'Ngày kết thúc BLTHHĐ',
										render: (data: IContractByActivity) =>
											data?.contractExecution?.endDate ? (
												<Moment date={data?.contractExecution?.endDate} format='DD/MM/YYYY' />
											) : (
												'---'
											),
									},
									{
										title: 'Giá trị BLTƯ (VND)',
										render: (data: IContractByActivity) => <>{convertCoin(data?.advanceGuarantee?.amount)}</>,
									},
									{
										title: 'Ngày kết thúc BLTƯ',
										render: (data: IContractByActivity) =>
											data?.advanceGuarantee?.endDate ? (
												<Moment date={data?.advanceGuarantee?.endDate} format='DD/MM/YYYY' />
											) : (
												'---'
											),
									},
									{
										title: 'Người tạo hợp đồng',
										render: (data: IContractByActivity) => <>{data?.user?.fullname}</>,
									},
									{
										title: 'Trạng thái',
										fixedRight: true,
										render: (data: IContractByActivity) => (
											<StateActive
												stateActive={data?.state}
												listState={[
													{
														state: STATE_CONTRACT_WORK.EXPIRED,
														text: 'Hết hạn',
														textColor: '#fff',
														backgroundColor: '#16C1F3',
													},
													{
														state: STATE_CONTRACT_WORK.PROCESSING,
														text: 'Đang thực hiện',
														textColor: '#fff',

														backgroundColor: '#06D7A0',
													},
													{
														state: STATE_CONTRACT_WORK.END,
														text: 'Đã hủy',
														textColor: '#fff',
														backgroundColor: '#F37277',
													},
												]}
											/>
										),
									},
								]}
							/>
						</DataWrapper>
						<Pagination
							currentPage={Number(_page) || 1}
							pageSize={Number(_pageSize) || 10}
							total={listContractByActivity?.pagination?.totalCount}
							dependencies={[_pageSize, _uuid]}
						/>
					</WrapperScrollbar>
				</div>
			</div>
		</div>
	);
}

export default DetailPageWork;
