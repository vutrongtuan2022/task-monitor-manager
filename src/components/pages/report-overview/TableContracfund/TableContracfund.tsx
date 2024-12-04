import React from 'react';
import styles from './TableContracfund.module.scss';
import {IContractFund, PropsTableContracFund} from './interface';
import clsx from 'clsx';
import WrapperScrollbar from '~/components/layouts/WrapperScrollbar';
import DataWrapper from '~/components/common/DataWrapper';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_CONFIG} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import {convertCoin} from '~/common/funcs/convertCoin';
import Moment from 'react-moment';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import overviewServices from '~/services/overviewServices';
import Tippy from '@tippyjs/react';
import Link from 'next/link';
import {PATH} from '~/constants/config';

function TableContracfund({}: PropsTableContracFund) {
	const router = useRouter();

	const {_uuid, _page, _pageSize} = router.query;

	const {data: listContractFundForOverView, isLoading} = useQuery([QUERY_KEY.table_contract_fund_for_overview, _uuid, _page, _pageSize], {
		queryFn: () =>
			httpRequest({
				http: overviewServices.listContractFundReportOverview({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 10,
					uuid: (_uuid as string) || '',
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
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
				<h4>Danh sách giải ngân</h4>
			</div>
			<WrapperScrollbar>
				<DataWrapper
					data={listContractFundForOverView?.items || []}
					loading={isLoading}
					noti={<Noti title='Danh sách hợp đồng trống!' des='Hiện tại chưa có hợp đồng nào!' />}
				>
					<Table
						fixedHeader={true}
						data={listContractFundForOverView?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IContractFund, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Số hợp đồng',
								fixedLeft: true,
								render: (data: IContractFund) => (
									<Tippy content='Chi tiết hợp đồng'>
										<Link
											href={`${PATH.ContractReportDisbursement}/${data?.activity?.contracts?.uuid}`}
											className={styles.link}
										>
											{data?.activity?.contracts?.code}
										</Link>
									</Tippy>
								),
							},
							{
								title: 'Tên công việc',
								render: (data: IContractFund) => <>{data?.activity?.name}</>,
							},
							{
								title: 'Vốn dự phòng (VND)',
								render: (data: IContractFund) => <>{convertCoin(data?.reverseAmount)}</>,
							},
							{
								title: 'Vốn dự án (VND)',
								render: (data: IContractFund) => <>{convertCoin(data?.amount)}</>,
							},
							{
								title: 'Ngày giải ngân',
								render: (data: IContractFund) => (
									<>{data?.releaseDate ? <Moment date={data?.releaseDate} format='DD/MM/YYYY' /> : '---'}</>
								),
							},
							{
								title: 'Ngày gửi báo cáo',
								render: (data: IContractFund) => (
									<>{data?.sendDate ? <Moment date={data?.sendDate} format='DD/MM/YYYY' /> : '---'}</>
								),
							},
							{
								title: 'Thuộc nhóm',
								render: (data: IContractFund) => <>{data?.contractor?.contractorCat?.name}</>,
							},
							{
								title: 'Tên nhà thầu',
								render: (data: IContractFund) => <>{data?.contractor?.name}</>,
							},
							{
								title: 'Mô tả',
								render: (data: IContractFund) => (
									<>
										{(data?.note && (
											<Tippy content={data?.note}>
												<p className={styles.name}>{data?.note || '---'}</p>
											</Tippy>
										)) ||
											'---'}
									</>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 10}
					total={listContractFundForOverView?.pagination?.totalCount}
					dependencies={[_uuid, _pageSize]}
				/>
			</WrapperScrollbar>
		</div>
	);
}

export default TableContracfund;
