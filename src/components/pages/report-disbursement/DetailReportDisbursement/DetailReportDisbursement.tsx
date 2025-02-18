import React, {useState} from 'react';

import {IDetailContractFund, IContractFund, PropsDetailReportDisbursement} from './interfaces';
import styles from './DetailReportDisbursement.module.scss';
import GridColumn from '~/components/layouts/GridColumn';
import Moment from 'react-moment';
import StateActive from '~/components/common/StateActive';
import {QUERY_KEY, STATE_REPORT_DISBURSEMENT, STATUS_CONFIG} from '~/constants/config/enum';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useRouter} from 'next/router';
import {httpRequest} from '~/services';
import {convertCoin} from '~/common/funcs/convertCoin';
import clsx from 'clsx';
import WrapperScrollbar from '~/components/layouts/WrapperScrollbar';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import Tippy from '@tippyjs/react';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Link from 'next/link';
import contractsFundServices from '~/services/contractsFundServices';
import Button from '~/components/common/Button';
import Dialog from '~/components/common/Dialog';
import icons from '~/constants/images/icons';
import Form from '~/components/common/Form';
import Popup from '~/components/common/Popup';
import TextArea from '~/components/common/Form/components/TextArea';

function DetailReportDisbursement({}: PropsDetailReportDisbursement) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuid, _page, _pageSize} = router.query;
	const [openConfirm, setOpenConfirm] = useState<boolean>(false);
	const [openCancel, setOpenCancel] = useState<boolean>(false);
	const [form, setForm] = useState<{feedback: string}>({
		feedback: '',
	});
	const {data: detailContractFund} = useQuery<IDetailContractFund>([QUERY_KEY.detail_report_disbursement, _uuid], {
		queryFn: () =>
			httpRequest({
				http: contractsFundServices.detailContractFund({
					uuid: _uuid as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_uuid,
	});

	const {data: listContractFund} = useQuery([QUERY_KEY.table_contract_report_disbursement, _page, _pageSize, _uuid], {
		queryFn: () =>
			httpRequest({
				http: contractsFundServices.detailContractFundFundPaged({
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

	const funcConfirm = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Duyệt báo cáo thành công!',
				http: contractsFundServices.approveContractFund({
					uuid: _uuid as string,
					isApproved: 1,
					reason: '',
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenConfirm(false);
				queryClient.invalidateQueries([QUERY_KEY.detail_report_disbursement]);
			}
		},
	});

	const funcCancel = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Từ chối báo cáo thành công!',
				http: contractsFundServices.approveContractFund({
					uuid: _uuid as string,
					isApproved: 0,
					reason: form.feedback,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenCancel(false);
				queryClient.invalidateQueries([QUERY_KEY.detail_report_disbursement]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						path: PATH.ReportDisbursement,
						title: 'Danh sách báo cáo giải ngân',
					},
					{
						path: '',
						title: 'Chi tiết báo cáo',
					},
				]}
				action={
					<div className={styles.group_btn}>
						{detailContractFund?.state == STATE_REPORT_DISBURSEMENT.REPORTED && (
							<>
								<Button p_14_24 rounded_8 green onClick={() => setOpenConfirm(true)}>
									Duyệt báo cáo
								</Button>
								<Button p_14_24 rounded_8 error onClick={() => setOpenCancel(true)}>
									Từ chối báo cáo
								</Button>
							</>
						)}
						<Button
							p_14_24
							rounded_8
							light-red
							onClick={(e) => {
								e.preventDefault();
								window.history.back();
							}}
						>
							Quay lại
						</Button>
					</div>
				}
			/>

			<div className={styles.main}>
				<div className={styles.basic_info}>
					<div className={styles.head}>
						<h4>Thông tin cơ bản</h4>
						<div className={styles.state}>
							<p>Trạng thái giải ngân:</p>
							<StateActive
								stateActive={detailContractFund?.state!}
								listState={[
									{
										state: STATE_REPORT_DISBURSEMENT.REJECTED,
										text: 'Bị từ chối',
										textColor: '#FFFFFF',
										backgroundColor: '#F37277',
									},
									{
										state: STATE_REPORT_DISBURSEMENT.REPORTED,
										text: 'Chưa xử lý',
										textColor: '#FFFFFF',
										backgroundColor: '#4BC9F0',
									},
									{
										state: STATE_REPORT_DISBURSEMENT.APPROVED,
										text: 'Đã duyệt',
										textColor: '#FFFFFF',
										backgroundColor: '#06D7A0',
									},
									{
										state: STATE_REPORT_DISBURSEMENT.NOT_REPORT,
										text: 'Chưa báo cáo',
										textColor: '#FFFFFF',
										backgroundColor: '#FF852C',
									},
								]}
							/>
						</div>
					</div>
					<div className={styles.progress_group}>
						<GridColumn col_3>
							<div className={styles.item}>
								<p>Tên công trình</p>
								<p>{detailContractFund?.project?.name || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Báo cáo tháng</p>
								<p>{`Tháng ${detailContractFund?.releasedMonth} - ${detailContractFund?.releasedYear}`}</p>
							</div>
							<div className={styles.item}>
								<p>Chi nhánh</p>
								<p>
									<span>{detailContractFund?.project?.branch?.code || '---'}</span> -
									<span style={{marginLeft: '4px'}}>{detailContractFund?.project?.branch?.name || '---'}</span>
								</p>
							</div>
							<div className={styles.item}>
								<p>Số hợp đồng giải ngân</p>
								<p>{detailContractFund?.contractCount || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Tổng số tiền giải ngân (VND)</p>
								<p>{convertCoin(detailContractFund?.totalAmount!) || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Người báo cáo</p>
								<p>{detailContractFund?.creator?.fullname || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Ngày gửi báo cáo</p>
								<p>
									{detailContractFund?.sendDate ? (
										<Moment date={detailContractFund?.sendDate} format='DD/MM/YYYY' />
									) : (
										'---'
									)}
								</p>
							</div>
							{/* <div className={styles.item}>
								<p>Mô tả</p>
								<p>{detailContractFund?.note || '---'}</p>
							</div> */}
							{detailContractFund?.state === STATE_REPORT_DISBURSEMENT.REJECTED && (
								<div className={styles.item}>
									<p>Lý do từ chối báo cáo giải ngân</p>
									<p>{detailContractFund?.rejectedReason || '---'}</p>
								</div>
							)}
						</GridColumn>
					</div>
				</div>
				<div className={clsx(styles.basic_info, styles.mt)}>
					<div className={styles.head}>
						<h4>Danh sách giải ngân</h4>
					</div>
					<WrapperScrollbar>
						<DataWrapper
							data={listContractFund?.items || []}
							loading={listContractFund?.isLoading}
							noti={<Noti title='Danh sách hợp đồng trống!' des='Hiện tại chưa có hợp đồng nào!' />}
						>
							<Table
								fixedHeader={true}
								data={listContractFund?.items || []}
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
										render: (data: IContractFund) => <>{data?.activity?.name}</>,
									},
									{
										title: 'Vốn dự phòng (VND)',
										render: (data: IContractFund) => <>{convertCoin(data?.reverseAmount)}</>,
									},
									{
										title: 'Vốn dự án (VND)',
										render: (data: IContractFund) => <>{convertCoin(data?.projectAmount)}</>,
									},
									{
										title: 'Ngày giải ngân',
										render: (data: IContractFund) => (
											<>{data?.releaseDate ? <Moment date={data?.releaseDate} format='DD/MM/YYYY' /> : '---'}</>
										),
									},
									{
										title: 'Số nhóm nhà thầu',
										render: (data: IContractFund) => (
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
														<span className={styles.link_contractor}>{data?.totalContractorCat || '---'}</span>
													</Tippy>
												)}
											</>
										),
									},
									{
										title: 'Số nhà thầu',
										render: (data: IContractFund) => (
											<>
												{data?.contractorInfos?.length && (
													<Tippy
														content={
															<ol style={{paddingLeft: '16px'}}>
																{[...new Set(data?.contractorInfos?.map((v) => v.contractorName))].map(
																	(catName, i) => (
																		<li key={i}>{catName}</li>
																	)
																)}
															</ol>
														}
													>
														<span className={styles.link_contractor}>{data?.totalContractor || '---'}</span>
													</Tippy>
												)}
											</>
										),
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
							total={listContractFund?.pagination?.totalCount}
							dependencies={[_pageSize, _uuid]}
						/>
					</WrapperScrollbar>
					<Dialog
						type='primary'
						open={openConfirm}
						icon={icons.success}
						onClose={() => setOpenConfirm(false)}
						title={'Duyệt báo cáo'}
						note={'Bạn có chắc chắn muốn duyệt báo cáo này không?'}
						onSubmit={funcConfirm.mutate}
					/>

					<Form form={form} setForm={setForm}>
						<Popup open={openCancel} onClose={() => setOpenCancel(false)}>
							<div className={styles.main_popup}>
								<div className={styles.head_popup}>
									<h4>Xác nhận từ chối duyệt báo cáo</h4>
								</div>
								<div className={styles.form_popup}>
									<TextArea name='feedback' placeholder='Nhập lý do từ chối' label='Lý do từ chối' />
									<div className={styles.group_button}>
										<div>
											<Button p_12_20 grey rounded_6 onClick={() => setOpenCancel(false)}>
												Hủy bỏ
											</Button>
										</div>
										<div className={styles.btn}>
											<Button disable={!form.feedback} p_12_20 error rounded_6 onClick={funcCancel.mutate}>
												Xác nhận
											</Button>
										</div>
									</div>
								</div>
							</div>
						</Popup>
					</Form>
				</div>
			</div>
		</div>
	);
}

export default DetailReportDisbursement;
