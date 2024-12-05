import React, {useState} from 'react';

import {IReportDisbursement, PropsMainPageReportDisbursement} from './interfaces';
import styles from './MainPageReportDisbursement.module.scss';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATE_REPORT_DISBURSEMENT, STATUS_CONFIG, TYPE_ACCOUNT} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import WrapperScrollbar from '~/components/layouts/WrapperScrollbar';
import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import Noti from '~/components/common/DataWrapper/components/Noti';
import {generateYearsArray} from '~/common/funcs/selectDate';
import StateActive from '~/components/common/StateActive';
import Moment from 'react-moment';
import {convertCoin} from '~/common/funcs/convertCoin';
import IconCustom from '~/components/common/IconCustom';
import {CloseCircle, Eye, TickCircle} from 'iconsax-react';
import {PATH} from '~/constants/config';
import Loading from '~/components/common/Loading';
import Dialog from '~/components/common/Dialog';
import icons from '~/constants/images/icons';
import Form from '~/components/common/Form';
import Popup from '~/components/common/Popup';
import TextArea from '~/components/common/Form/components/TextArea';
import Button from '~/components/common/Button';
import contractsFundServices from '~/services/contractsFundServices';
import userServices from '~/services/userServices';
import projectServices from '~/services/projectServices';
import Tippy from '@tippyjs/react';

function MainPageReportDisbursement({}: PropsMainPageReportDisbursement) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const years = generateYearsArray();
	const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	const {_page, _pageSize, _keyword, _year, _month, _state, _reporterUuid, _project} = router.query;

	const [uuidConfirm, setUuidConfirm] = useState<string>('');
	const [uuidCancel, setUuidCancel] = useState<string>('');
	const [form, setForm] = useState<{feedback: string}>({
		feedback: '',
	});

	const {data: listUser} = useQuery([QUERY_KEY.dropdown_user], {
		queryFn: () =>
			httpRequest({
				http: userServices.categoryUser({
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
					roleUuid: '',
					type: TYPE_ACCOUNT.USER,
				}),
			}),
		select(data) {
			return data;
		},
	});

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

	const listReportDisbursement = useQuery(
		[QUERY_KEY.table_list_report_disbursement, _page, _pageSize, _keyword, _year, _month, _state, _reporterUuid, _project],
		{
			queryFn: () =>
				httpRequest({
					http: contractsFundServices.getPmContractFundPaged({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 10,
						keyword: (_keyword as string) || '',
						status: STATUS_CONFIG.ACTIVE,
						year: !!_year ? Number(_year) : null,
						month: !!_month ? Number(_month) : null,
						state: !!_state ? Number(_state) : null,
						projectUuid: (_project as string) || '',
						userUuid: (_reporterUuid as string) || '',
					}),
				}),
			select(data) {
				return data;
			},
		}
	);

	const funcConfirm = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Duyệt báo cáo thành công!',
				http: contractsFundServices.approveContractFund({
					uuid: uuidConfirm,
					isApproved: 1,
					reason: '',
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setUuidConfirm('');
				queryClient.invalidateQueries([QUERY_KEY.table_list_report_disbursement]);
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
					uuid: uuidCancel,
					isApproved: 0,
					reason: form.feedback,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setUuidCancel('');
				queryClient.invalidateQueries([QUERY_KEY.table_list_report_disbursement]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading loading={funcConfirm.isLoading || funcCancel.isLoading} />
			<div className={styles.head}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo tên công trình' />
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
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Người báo cáo'
							query='_reporterUuid'
							listFilter={listUser?.map((v: any) => ({
								id: v?.uuid,
								name: v?.fullname,
							}))}
						/>
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Năm'
							query='_year'
							listFilter={years?.map((v) => ({
								id: v,
								name: `Năm ${v}`,
							}))}
						/>
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Tháng'
							query='_month'
							listFilter={months?.map((v) => ({
								id: v,
								name: `Tháng ${v}`,
							}))}
						/>
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Trạng thái'
							query='_state'
							listFilter={[
								{
									id: STATE_REPORT_DISBURSEMENT.NOT_REPORT,
									name: 'Chưa báo cáo',
								},
								{
									id: STATE_REPORT_DISBURSEMENT.REPORTED,
									name: 'Đã báo cáo',
								},
								{
									id: STATE_REPORT_DISBURSEMENT.APPROVED,
									name: 'Đã duyệt',
								},
								{
									id: STATE_REPORT_DISBURSEMENT.REJECTED,
									name: 'Bị từ chối',
								},
							]}
						/>
					</div>
				</div>
			</div>
			<WrapperScrollbar>
				<DataWrapper
					data={listReportDisbursement?.data?.items || []}
					loading={listReportDisbursement.isLoading}
					noti={<Noti title='Dữ liệu trống!' des='Danh sách báo cáo công việc trống!' />}
				>
					<Table
						fixedHeader={true}
						data={listReportDisbursement?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IReportDisbursement, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Tên công trình',
								fixedLeft: true,
								render: (data: IReportDisbursement) => (
									<Tippy content={data?.project?.name}>
										<p className={styles.name}>{data?.project?.name}</p>
									</Tippy>
								),
							},
							{
								title: 'Báo cáo tháng',
								render: (data: IReportDisbursement) => <>{`Tháng ${data?.releasedMonth} - ${data?.releasedYear}`}</>,
							},
							{
								title: 'Người báo cáo',
								render: (data: IReportDisbursement) => <>{data?.creator?.fullname || '---'}</>,
							},

							{
								title: 'Lãnh đạo phụ trách',
								render: (data: IReportDisbursement) => <>{data?.project?.leader?.fullname}</>,
							},
							{
								title: 'Vốn dự phòng (VND)',
								render: (data: IReportDisbursement) => <>{convertCoin(data?.reverseAmount) || '---'}</>,
							},
							{
								title: 'Vốn dự án (VND)',
								render: (data: IReportDisbursement) => <>{convertCoin(data?.projectAmount) || '---'}</>,
							},
							{
								title: 'Kế hoạch vốn năm (VND)',
								render: (data: IReportDisbursement) => <>{convertCoin(data?.yearlyBudget) || '---'}</>,
							},
							{
								title: 'Tổng mức đầu tư (VND)',
								render: (data: IReportDisbursement) => <>{convertCoin(data?.totalBudget) || '---'}</>,
							},
							{
								title: 'Ngày gửi báo cáo',
								render: (data: IReportDisbursement) => (
									<p>{data?.sendDate ? <Moment date={data?.sendDate} format='DD/MM/YYYY' /> : '---'}</p>
								),
							},
							{
								title: 'Trạng thái',
								render: (data: IReportDisbursement) => (
									<StateActive
										stateActive={data?.state}
										listState={[
											{
												state: STATE_REPORT_DISBURSEMENT.REJECTED,
												text: 'Bị từ chối',
												textColor: '#FFFFFF',
												backgroundColor: '#F37277',
											},
											{
												state: STATE_REPORT_DISBURSEMENT.REPORTED,
												text: 'Đã báo cáo',
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
								),
							},
							{
								title: 'Hành động',
								fixedRight: true,
								render: (data: IReportDisbursement) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										{data?.state == STATE_REPORT_DISBURSEMENT.REPORTED && (
											<>
												<IconCustom
													color='#06D7A0'
													icon={<TickCircle fontSize={20} fontWeight={600} />}
													tooltip='Duyệt báo cáo'
													onClick={() => setUuidConfirm(data?.uuid)}
												/>
												<IconCustom
													color='#EE464C'
													icon={<CloseCircle fontSize={20} fontWeight={600} />}
													tooltip='Từ chối báo cáo'
													onClick={() => setUuidCancel(data?.uuid)}
												/>
											</>
										)}
										<IconCustom
											color='#005994'
											icon={<Eye fontSize={20} fontWeight={600} />}
											tooltip='Xem chi tiết'
											href={`${PATH.ReportDisbursement}/${data?.uuid}`}
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
					total={listReportDisbursement?.data?.pagination?.totalCount}
					dependencies={[_pageSize, _keyword, _year, _month, _state, _reporterUuid, _project]}
				/>
			</WrapperScrollbar>

			<Dialog
				type='primary'
				open={!!uuidConfirm}
				icon={icons.success}
				onClose={() => setUuidConfirm('')}
				title={'Duyệt báo cáo'}
				note={'Bạn có chắc chắn muốn duyệt báo cáo này không?'}
				onSubmit={funcConfirm.mutate}
			/>

			<Form form={form} setForm={setForm}>
				<Popup open={!!uuidCancel} onClose={() => setUuidCancel('')}>
					<div className={styles.main_popup}>
						<div className={styles.head_popup}>
							<h4>Xác nhận từ chối duyệt báo cáo giải ngân</h4>
						</div>
						<div className={styles.form_poup}>
							<TextArea name='feedback' placeholder='Nhập lý do từ chối' label='Lý do từ chối' />
							<div className={styles.group_button}>
								<div>
									<Button p_12_20 grey rounded_6 onClick={() => setUuidCancel('')}>
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

export default MainPageReportDisbursement;
