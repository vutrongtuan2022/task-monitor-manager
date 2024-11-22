import React, {useState} from 'react';

import {IDetailReportWork, PropsDetailReportWork} from './interfaces';
import styles from './DetailReportWork.module.scss';
import {PATH} from '~/constants/config';
import Breadcrumb from '~/components/common/Breadcrumb';
import StateActive from '~/components/common/StateActive';
import {QUERY_KEY, STATE_COMPLETE_REPORT, STATE_REPORT} from '~/constants/config/enum';
import GridColumn from '~/components/layouts/GridColumn';
import clsx from 'clsx';
import TabNavLink from '~/components/common/TabNavLink';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import reportServices from '~/services/reportServices';
import Moment from 'react-moment';
import TableReportWorkLastMonth from './components/TableReportWorkLastMonth';
import TableReportWorkCurrent from './components/TableReportWorkCurrent';
import Button from '~/components/common/Button';
import Loading from '~/components/common/Loading';
import Dialog from '~/components/common/Dialog';
import icons from '~/constants/images/icons';
import Form from '~/components/common/Form';
import Popup from '~/components/common/Popup';
import TextArea from '~/components/common/Form/components/TextArea';

function DetailReportWork({}: PropsDetailReportWork) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuid, _type} = router.query;

	const [openConfirm, setOpenConfirm] = useState<boolean>(false);
	const [openCancel, setOpenCancel] = useState<boolean>(false);
	const [form, setForm] = useState<{note: string}>({
		note: '',
	});

	const {data: detailReportWork} = useQuery<IDetailReportWork>([QUERY_KEY.detail_report_work, _uuid], {
		queryFn: () =>
			httpRequest({
				http: reportServices.detailReport({
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
				http: reportServices.approveReport({
					uuid: _uuid as string,
					isApprove: 1,
					note: '',
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenConfirm(false);
				queryClient.invalidateQueries([QUERY_KEY.detail_report_work]);
			}
		},
	});

	const funcCancel = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Từ chối báo cáo thành công!',
				http: reportServices.approveReport({
					uuid: _uuid as string,
					isApprove: 0,
					note: form.note,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenCancel(false);
				queryClient.invalidateQueries([QUERY_KEY.detail_report_work]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading loading={funcConfirm.isLoading || funcCancel.isLoading} />
			<Breadcrumb
				listUrls={[
					{
						path: PATH.ReportWork,
						title: 'Báo cáo công việc',
					},
					{
						path: '',
						title: 'Chi tiết báo cáo',
					},
				]}
				action={
					<div className={styles.group_btn}>
						{detailReportWork?.state == STATE_REPORT.PENDING_APPROVAL && (
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
							<p>Trạng thái báo cáo:</p>
							<StateActive
								stateActive={detailReportWork?.state!}
								listState={[
									{
										state: STATE_REPORT.REJECTED,
										text: 'Bị từ chối',
										textColor: '#fff',
										backgroundColor: '#EE464C',
									},
									{
										state: STATE_REPORT.REPORTED,
										text: 'Đã duyệt',
										textColor: '#fff',
										backgroundColor: '#06D7A0',
									},
									{
										state: STATE_REPORT.PENDING_APPROVAL,
										text: 'Chưa xử lý',
										textColor: '#fff',
										backgroundColor: '#5B70B3',
									},
									{
										state: STATE_REPORT.IN_PROGRESS,
										text: 'Chưa báo cáo',
										textColor: '#fff',
										backgroundColor: '#F69E51',
									},
								]}
							/>
						</div>
					</div>
					<div className={styles.progress_group}>
						<GridColumn col_3>
							<div className={styles.item}>
								<p>Tên công trình</p>
								<p>{detailReportWork?.project?.name}</p>
							</div>
							<div className={styles.item}>
								<p>Kế hoạch</p>
								<p>
									Tháng {detailReportWork?.month} - {detailReportWork?.year}
								</p>
							</div>
							<div className={styles.item}>
								<p>Tình trạng</p>
								<StateActive
									isBox={false}
									stateActive={detailReportWork?.completeState}
									listState={[
										{
											state: STATE_COMPLETE_REPORT.NOT_DONE,
											text: 'Chưa thực hiện',
											textColor: '#FF852C',
											backgroundColor: '#FF852C',
										},
										{
											state: STATE_COMPLETE_REPORT.ON_SCHEDULE,
											text: 'Đúng tiến độ',
											textColor: '#005994',
											backgroundColor: '#005994',
										},
										{
											state: STATE_COMPLETE_REPORT.SLOW_PROGRESS,
											text: 'Chậm tiến độ',
											textColor: '#EE464C',
											backgroundColor: '#EE464C',
										},
									]}
								/>
							</div>
							<div className={styles.item}>
								<p>Công việc thực hiện</p>
								<p>
									<span style={{color: '#2970FF'}}>{detailReportWork?.completedActivity}</span>/
									<span>{detailReportWork?.totalActivity}</span>
								</p>
							</div>
							<div className={styles.item}>
								<p>Ngày gửi báo cáo</p>
								<p>
									{detailReportWork?.completed ? (
										<Moment date={detailReportWork?.completed} format='DD/MM/YYYY' />
									) : (
										'---'
									)}
								</p>
							</div>
							<div className={styles.item}>
								<p>Người gửi báo cáo</p>
								<p>{detailReportWork?.reporter?.fullname}</p>
							</div>
							<div className={styles.item}>
								<p>Mô tả</p>
								<p>{detailReportWork?.note || '---'}</p>
							</div>
							{detailReportWork?.state === STATE_REPORT.REJECTED && (
								<div className={styles.item}>
									<p>Lý do từ chối</p>
									<p>{detailReportWork?.rejectedReason || '---'}</p>
								</div>
							)}
						</GridColumn>
					</div>
				</div>

				<div className={clsx(styles.basic_info, styles.mt)}>
					<div className={styles.main_tab}>
						<TabNavLink
							query='_type'
							listHref={[
								{
									pathname: PATH.ProjectCreate,
									query: null,
									title: 'Báo cáo tháng trước',
								},
								{
									pathname: PATH.ProjectCreate,
									query: 'report',
									title: 'Báo cáo hiện tại',
								},
							]}
							listKeyRemove={['_page', '_pageSize', '_keyword', '_state']}
						/>
					</div>
					<div className={styles.line}></div>
					<div className={styles.head}>
						<h4>Danh sách công việc</h4>
					</div>
					<div className={styles.main_table}>
						{!_type && <TableReportWorkLastMonth />}
						{_type == 'report' && <TableReportWorkCurrent />}
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
							<h4>Xác nhận từ chối duyệt báo cáo</h4>
						</div>
						<div className={styles.form_popup}>
							<TextArea name='note' placeholder='Nhập lý do từ chối' label='Lý do từ chối' />
							<div className={styles.group_button}>
								<div>
									<Button p_12_20 grey rounded_6 onClick={() => setOpenCancel(false)}>
										Hủy bỏ
									</Button>
								</div>
								<div className={styles.btn}>
									<Button disable={!form.note} p_12_20 error rounded_6 onClick={funcCancel.mutate}>
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

export default DetailReportWork;
