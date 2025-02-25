import Button from '~/components/common/Button';
import {IWorkCancel, PropsTableListWorkCancel} from './interfaces';
import styles from './TableListWorkCancel.module.scss';
import {FolderOpen} from 'iconsax-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATE_COMPLETE_REPORT, STATE_WORK} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import activityServices from '~/services/activityServices';
import DataWrapper from '~/components/common/DataWrapper';
import StateActive from '~/components/common/StateActive';
import Noti from '~/components/common/DataWrapper/components/Noti';
import TableChecked from '~/components/common/TableChecked';
import Tippy from '@tippyjs/react';
import {useCallback, useMemo, useState} from 'react';
import reportServices from '~/services/reportServices';
import Loading from '~/components/common/Loading';
import Form from '~/components/common/Form';
import TextArea from '~/components/common/Form/components/TextArea';
import {toastWarn} from '~/common/funcs/toast';

function TableListWorkCancel({reportUuid, queryKeys, onClose}: PropsTableListWorkCancel) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{note: string}>({
		note: '',
	});
	const [listWorkChecked, setListWorkChecked] = useState<IWorkCancel[]>([]);

	// Data reponsive api
	const {data: listWorkReport = [], isLoading} = useQuery<IWorkCancel[]>([QUERY_KEY.table_list_work_cancel_report], {
		queryFn: () =>
			httpRequest({
				http: activityServices.getActivityInReportForDecline({
					uuid: reportUuid,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!reportUuid,
	});

	// Xử lý check all ==> Thêm tất cả dữ liệu api trả về vào mảng state
	const handleCheckedAll = useCallback(
		(e: any) => {
			const {checked} = e.target;

			if (checked) {
				setListWorkChecked((prev) => [...prev, ...listWorkReport]);
			} else {
				setListWorkChecked((prev) => {
					return prev?.filter((v) => listWorkReport?.every((x) => x?.activityReportUuid != v?.activityReportUuid));
				});
			}
		},
		[listWorkReport]
	);

	// Xử lý check row (item)
	const handleCheckedRow = (e: any, data: any) => {
		const {checked} = e.target;

		if (checked) {
			setListWorkChecked((prev) => [...prev, data]);
		} else {
			setListWorkChecked((prev) => {
				return prev?.filter((v) => v?.activityReportUuid != data?.activityReportUuid);
			});
		}
	};

	// Xử lý trạng thái checked của row (item)
	const handleIsCheckedRow = (data: any) => {
		return listWorkChecked?.some((v) => v?.activityReportUuid == data?.activityReportUuid);
	};

	// Xử lý trạng thái checked all
	const isCheckedAll = useMemo(() => {
		return listWorkReport?.every((v) => {
			return listWorkChecked?.some((x) => x?.activityReportUuid == v?.activityReportUuid);
		});
	}, [listWorkReport, listWorkChecked]);

	const funcDeclineWorkReport = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xác nhận công việc thành công!',
				http: reportServices.declineWorkReport({
					reportUuid: reportUuid,
					reason: form?.note,
					activityReports: listWorkReport?.map((v: any) => ({
						activityReportUuid: v?.activityReportUuid,
						isDecline: listWorkChecked.some((x) => x.activityReportUuid == v.activityReportUuid) ? true : false,
					})),
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				onClose();
				queryKeys?.map((key) => queryClient.invalidateQueries([key]));
			}
		},
	});

	const handleSubmit = () => {
		if (listWorkChecked.length == 0) {
			return toastWarn({msg: 'Cần phải từ chối ít nhất một công việc!'});
		}

		return funcDeclineWorkReport.mutate();
	};

	return (
		<Form form={form} setForm={setForm}>
			<div className={styles.container}>
				<Loading loading={funcDeclineWorkReport.isLoading} />
				<div className={styles.head}>
					<h4 className={styles.title}>Chọn công việc bị từ chối ({listWorkChecked?.length})</h4>
					<div className={styles.group_button}>
						<div>
							<Button p_12_20 grey rounded_6 onClick={onClose}>
								Hủy bỏ
							</Button>
						</div>
						<div className={styles.btn}>
							<Button p_12_20 primary rounded_6 icon={<FolderOpen size={18} color='#fff' />} onClick={handleSubmit}>
								Xác nhận
							</Button>
						</div>
					</div>
				</div>
				<div className={styles.line}></div>
				<div className={styles.form}>
					<div className={styles.table}>
						<DataWrapper
							data={listWorkReport || []}
							loading={isLoading}
							noti={<Noti title='Danh sách trống!' des='Danh sách công việc trống!' />}
						>
							<TableChecked
								fixedHeader={true}
								isCheckedAll={isCheckedAll}
								handleCheckedAll={handleCheckedAll}
								handleCheckedRow={handleCheckedRow}
								handleIsCheckedRow={handleIsCheckedRow}
								data={listWorkReport || []}
								column={[
									{
										title: 'STT',
										render: (data: IWorkCancel, index: number) => <>{index + 1}</>,
									},
									{
										title: 'Tên công việc',
										render: (data: IWorkCancel) => (
											<Tippy content={data?.activity?.name}>
												<p className={styles.name}>{data?.activity?.name || '---'}</p>
											</Tippy>
										),
									},
									{
										title: 'Thuộc nhóm công việc',
										render: (data: IWorkCancel) => (
											<Tippy content={data?.parent?.name || '---'}>
												<p className={styles.group_task}>{data?.parent?.name || '---'}</p>
											</Tippy>
										),
									},
									{
										title: 'Giai đoạn thực hiện',
										render: (data: IWorkCancel) => (
											<>
												{data?.stage == -1 && '---'}
												{data?.stage == 1 && 'Giai đoạn chuẩn bị đầu tư'}
												{data?.stage == 2 && 'Giai đoạn thực hiện đầu tư'}
												{data?.stage == 3 && 'Giai đoạn kết thúc đầu tư'}
											</>
										),
									},
									{
										title: 'Megatype',
										render: (data: IWorkCancel) => <>{data?.megaType || '---'}</>,
									},
									{
										title: 'Trạng thái',
										render: (data: IWorkCancel) => (
											<StateActive
												stateActive={data?.state}
												listState={[
													{
														state: STATE_WORK.NOT_PROCESSED,
														text: 'Chưa xử lý',
														textColor: '#FFFFFF',
														backgroundColor: '#FDAD73',
													},
													{
														state: STATE_WORK.PROCESSING,
														text: 'Đang xử lý',
														textColor: '#FFFFFF',
														backgroundColor: '#5B70B3',
													},
													{
														state: STATE_WORK.COMPLETED,
														text: 'Đã hoàn thành',
														textColor: '#FFFFFF',
														backgroundColor: '#16C1F3',
													},
													{
														state: STATE_WORK.REJECTED,
														text: 'Bị từ chối',
														textColor: '#FFFFFF',
														backgroundColor: '#EE464C',
													},
													{
														state: STATE_WORK.APPROVED,
														text: 'Đã được duyệt',
														textColor: '#FFFFFF',
														backgroundColor: '#06D7A0',
													},
												]}
											/>
										),
									},
									{
										title: 'Tình trạng',
										render: (data: IWorkCancel) => (
											<StateActive
												isBox={false}
												stateActive={data?.completeState}
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
										),
									},
									{
										title: 'Từ chối',
										checkBox: true,
										render: (data: IWorkCancel) => <></>,
									},
								]}
							/>
						</DataWrapper>
					</div>

					<div className={styles.note}>
						<TextArea name='note' placeholder='Nhập lý do từ chối' blur={true} label={<span>Lý do từ chối</span>} />
					</div>
				</div>
			</div>
		</Form>
	);
}

export default TableListWorkCancel;
