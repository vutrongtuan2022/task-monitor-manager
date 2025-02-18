import React from 'react';
import styles from './TableContractHistory.module.scss';
import DataWrapper from '~/components/common/DataWrapper';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY, STATE_CONTRACT_WORK, STATUS_CONFIG} from '~/constants/config/enum';
import {useRouter} from 'next/router';
import {httpRequest} from '~/services';
import contractsServices from '~/services/contractsServices';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import {IContractByActivity} from './interface';
import Tippy from '@tippyjs/react';
import Link from 'next/link';
import {PATH} from '~/constants/config';
import {convertCoin} from '~/common/funcs/convertCoin';
import Moment from 'react-moment';
import StateActive from '~/components/common/StateActive';
import Pagination from '~/components/common/Pagination';
import clsx from 'clsx';
function TableContractHistory() {
	const router = useRouter();

	const {_page, _pageSize, _uuid} = router.query;

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
		<div>
			<div className={styles.head}>
				<h4>Lịch sử hợp đồng chính</h4>
			</div>
			<div className={clsx(styles.basic_info, styles.mt)}>
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
										<Link href={`${PATH.ContractWork}/${data?.uuid}?_uuidWork=${_uuid}`} className={styles.link}>
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
								title: 'Số nhóm nhà thầu',
								render: (data: IContractByActivity) => (
									<>
										{data?.contractorInfos?.length && (
											<Tippy
												content={
													<ol style={{paddingLeft: '16px'}}>
														{[...new Set(data?.contractorInfos?.map((v) => v.contractorCatName))].map(
															(catName, i) => (
																<li key={i}>{catName}</li>
															)
														)}
													</ol>
												}
											>
												<span style={{color: '#2970FF'}}>{data?.totalContractorCat || '---'}</span>
											</Tippy>
										)}
									</>
								),
							},
							{
								title: 'Số nhà thầu',
								render: (data: IContractByActivity) => (
									<>
										{data?.contractorInfos?.length && (
											<Tippy
												content={
													<ol style={{paddingLeft: '16px'}}>
														{...data?.contractorInfos?.map((v, i) => <li key={i}>{v?.contractorName}</li>)}
													</ol>
												}
											>
												<span style={{color: '#2970FF'}}>{data?.totalContractor || '---'}</span>
											</Tippy>
										)}
									</>
								),
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
			</div>
		</div>
	);
}

export default TableContractHistory;
