import React, {useState} from 'react';

import {IDetailReportDisbursement, PropsDetailReportDisbursement} from './interfaces';
import styles from './DetailReportDisbursement.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import GridColumn from '~/components/layouts/GridColumn';
import {QUERY_KEY, STATE_REPORT_DISBURSEMENT} from '~/constants/config/enum';
import StateActive from '~/components/common/StateActive';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import projectFundServices from '~/services/projectFundServices';
import {convertCoin} from '~/common/funcs/convertCoin';
import Progress from '~/components/common/Progress';
import Moment from 'react-moment';
import Dialog from '~/components/common/Dialog';
import icons from '~/constants/images/icons';
import Loading from '~/components/common/Loading';
import Form from '~/components/common/Form';
import Popup from '~/components/common/Popup';
import TextArea from '~/components/common/Form/components/TextArea';

function DetailReportDisbursement({}: PropsDetailReportDisbursement) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuid} = router.query;

	const [openConfirm, setOpenConfirm] = useState<boolean>(false);
	const [openCancel, setOpenCancel] = useState<boolean>(false);
	const [form, setForm] = useState<{feedback: string}>({
		feedback: '',
	});

	const {data: detailReportDisbursement} = useQuery<IDetailReportDisbursement>([QUERY_KEY.detail_project_fund, _uuid], {
		queryFn: () =>
			httpRequest({
				http: projectFundServices.detailProjectFund({
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
				http: projectFundServices.approvedFund({
					uuid: _uuid as string,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenConfirm(false);
				queryClient.invalidateQueries([QUERY_KEY.detail_project_fund]);
			}
		},
	});

	const funcCancel = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Từ chối báo cáo thành công!',
				http: projectFundServices.rejectFund({
					uuid: _uuid as string,
					feedback: form.feedback,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenCancel(false);
				queryClient.invalidateQueries([QUERY_KEY.detail_project_fund]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading loading={funcConfirm.isLoading || funcCancel.isLoading} />
			<Breadcrumb
				listUrls={[
					{
						path: PATH.ReportDisbursement,
						title: 'Báo cáo giải ngân',
					},
					{
						path: '',
						title: 'Chi tiết giải ngân',
					},
				]}
				action={
					<div className={styles.group_btn}>
						{detailReportDisbursement?.approved == STATE_REPORT_DISBURSEMENT.PENDING_APPROVAL && (
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
							<p>Trạng thái dự án:</p>
							<StateActive
								stateActive={detailReportDisbursement?.approved!}
								listState={[
									{
										state: STATE_REPORT_DISBURSEMENT.PENDING_APPROVAL,
										text: 'Chưa xử lý',
										textColor: '#fff',
										backgroundColor: '#5B70B3',
									},
									{
										state: STATE_REPORT_DISBURSEMENT.REJECTED,
										text: 'Bị từ chối',
										textColor: '#fff',
										backgroundColor: '#EE464C',
									},
									{
										state: STATE_REPORT_DISBURSEMENT.REPORTED,
										text: 'Đã duyệt',
										textColor: '#fff',
										backgroundColor: '#06D7A0',
									},
								]}
							/>
						</div>
					</div>
					<div className={styles.form}>
						<GridColumn col_3>
							<div className={styles.item}>
								<p>Tên công trình</p>
								<p>{detailReportDisbursement?.project?.name || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Báo cáo tháng</p>
								<p>{detailReportDisbursement?.monthReport || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Tổng mức đầu tư (VND)</p>
								<p>{convertCoin(detailReportDisbursement?.totalInvest || 0) || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Kế hoạch vốn năm (VND)</p>
								<p>{convertCoin(detailReportDisbursement?.annualBudget || 0) || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Số tiền giải ngân (VND)</p>
								<p>{convertCoin(detailReportDisbursement?.realeaseBudget || 0) || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Lũy kế toàn bộ dự án (VND)</p>
								<p>{convertCoin(detailReportDisbursement?.projectAccumAmount || 0) || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Thêm lũy kế theo năm (VND)</p>
								<p>{convertCoin(detailReportDisbursement?.annualAccumAmount || 0) || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Tỷ lệ giải ngân</p>
								<Progress percent={detailReportDisbursement?.fundProgress!} width={80} />
							</div>
							<div className={styles.item}>
								<p>Người báo cáo</p>
								<p>{detailReportDisbursement?.reporter?.fullname || '---'}</p>
							</div>
							<div className={styles.item}>
								<p>Ngày gửi báo cáo</p>
								<p>
									{detailReportDisbursement?.created ? (
										<Moment date={detailReportDisbursement?.created} format='DD/MM/YYYY' />
									) : (
										'---'
									)}
								</p>
							</div>
							<div className={styles.item}>
								<p>Mô tả</p>
								<p>{detailReportDisbursement?.note || '---'}</p>
							</div>
							{detailReportDisbursement?.approved == STATE_REPORT_DISBURSEMENT.REJECTED && (
								<div className={styles.item}>
									<p>Lý do từ chối báo cáo giải ngân</p>
									<p>{detailReportDisbursement?.feedback || '---'}</p>
								</div>
							)}
						</GridColumn>
					</div>
				</div>
			</div>

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
							<h4>Xác nhận từ chối duyệt báo cáo giải ngân</h4>
						</div>
						<div className={styles.form}>
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
	);
}

export default DetailReportDisbursement;
