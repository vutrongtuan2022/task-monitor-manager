import React, {useState} from 'react';
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
import {Eye} from 'iconsax-react';
import IconCustom from '~/components/common/IconCustom';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import overviewServices from '~/services/overviewServices';
import Tippy from '@tippyjs/react';
import Link from 'next/link';
import {PATH} from '~/constants/config';
import PositionContainer from '~/components/common/PositionContainer';
import DetailContractFund from '../DetailContractFund';

function TableContracfund({}: PropsTableContracFund) {
	const router = useRouter();

	const {_uuid, _page, _pageSize} = router.query;
	const [uuidContractFund, setUuidContractFund] = useState<{
		contractUuid: string;
		overviewReportUuid: string;
		code: string;
	} | null>(null);
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
										<Link href={`${PATH.ContractReportDisbursement}/${data?.uuid}`} className={styles.link}>
											{data?.code}
										</Link>
									</Tippy>
								),
							},
							{
								title: 'Tên công việc',
								render: (data: IContractFund) => (
									<Tippy content={data?.activity?.name}>
										<p className={styles.name}>{data?.activity?.name}</p>
									</Tippy>
								),
							},
							{
								title: 'Tổng giá trị giải ngân (VND)',
								render: (data: IContractFund) => <>{convertCoin(data?.totalAmount)}</>,
							},
							{
								title: 'Sử dụng vốn dự phòng (VND)',
								render: (data: IContractFund) => <>{convertCoin(data?.reverseAmount)}</>,
							},
							{
								title: 'Sử dụng vốn dự án (VND)',
								render: (data: IContractFund) => <>{convertCoin(data?.projectAmount)}</>,
							},
							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: IContractFund) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<IconCustom
											type='edit'
											icon={<Eye fontSize={20} fontWeight={600} />}
											tooltip='Xem chi tiết'
											onClick={() =>
												setUuidContractFund({
													contractUuid: data?.uuid || '',
													overviewReportUuid: (_uuid as string) || '',
													code: data?.code || '',
												})
											}
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
					total={listContractFundForOverView?.pagination?.totalCount}
					dependencies={[_uuid, _pageSize]}
				/>
			</WrapperScrollbar>
			<PositionContainer open={!!uuidContractFund} onClose={() => setUuidContractFund(null)}>
				<DetailContractFund onClose={() => setUuidContractFund(null)} userContractFund={uuidContractFund!} />
			</PositionContainer>
		</div>
	);
}

export default TableContracfund;
