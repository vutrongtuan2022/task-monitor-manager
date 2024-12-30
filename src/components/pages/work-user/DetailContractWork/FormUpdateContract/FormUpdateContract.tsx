import React, {useState} from 'react';

import {PropsFormUpdateContract} from './interfaces';
import styles from './FormUpdateContract.module.scss';
import Button from '~/components/common/Button';
import Form, {FormContext, Input} from '~/components/common/Form';
import {FolderOpen} from 'iconsax-react';
import {IoClose} from 'react-icons/io5';
import clsx from 'clsx';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_CONFIG} from '~/constants/config/enum';
import contractorServices from '~/services/contractorServices';
import {httpRequest} from '~/services';
import {useRouter} from 'next/router';
import Select, {Option} from '~/components/common/Select';
import contractorcatServices from '~/services/contractorcatServices';
import DatePicker from '~/components/common/DatePicker';
import {toastWarn} from '~/common/funcs/toast';
import contractsServices from '~/services/contractsServices';
import moment from 'moment';
import {convertCoin, price} from '~/common/funcs/convertCoin';
import Loading from '~/components/common/Loading';

interface IFormUpdateContract {
	uuidActivity: string;
	nameActivity: string;
	code: string;
	contractorUuid: string;
	contractorGroupUuid: string;
	startDate: string;
	totalDayAdvantage: number | null;
	amount: number | string;
	contractExecutionAmount: number | string;
	contractExecutionEndDate: string;
	advanceGuaranteeAmount: number | string;
	advanceGuaranteeEndDate: string;
}

function FormUpdateContract({onClose}: PropsFormUpdateContract) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuid} = router.query;

	const [form, setForm] = useState<IFormUpdateContract>({
		uuidActivity: '',
		nameActivity: '',
		code: '',
		contractorUuid: '',
		contractorGroupUuid: '',
		startDate: '',
		totalDayAdvantage: null,
		amount: 0,
		contractExecutionAmount: 0,
		contractExecutionEndDate: '',
		advanceGuaranteeAmount: 0,
		advanceGuaranteeEndDate: '',
	});

	useQuery([QUERY_KEY.detail_contract], {
		queryFn: () =>
			httpRequest({
				http: contractsServices.detailContracts({
					uuid: _uuid as string,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					uuidActivity: data?.activityDTO?.uuid || '',
					nameActivity: data?.activityDTO?.name || '',
					code: data?.code || '',
					contractorUuid: data?.contractorDTO?.uuid || '',
					contractorGroupUuid: data?.contractorDTO?.contractorCat?.uuid || '',
					startDate: data?.startDate || '',
					totalDayAdvantage: data?.totalDayAdvantage || null,
					amount: convertCoin(data?.amount),
					contractExecutionAmount: convertCoin(data?.contractExecution?.amount),
					contractExecutionEndDate: data?.contractExecution?.endDate || '',
					advanceGuaranteeAmount: convertCoin(data?.advanceGuarantee?.amount),
					advanceGuaranteeEndDate: data?.advanceGuarantee?.endDate || '',
				});
			}
		},
		enabled: !!_uuid,
	});

	const {data: dropdownContractorInProject} = useQuery([QUERY_KEY.dropdown_contractor_in_project], {
		queryFn: () =>
			httpRequest({
				http: contractorServices.categoryContractorInProject({
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
					uuid: form?.uuidActivity,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!form?.uuidActivity,
	});

	const {data: listGroupContractor} = useQuery([QUERY_KEY.dropdown_group_contractor], {
		queryFn: () =>
			httpRequest({
				http: contractorcatServices.categoryContractorCat({
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const funcUpdateContract = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa hợp đồng thành công!',
				http: contractsServices.upsertContracts({
					uuid: _uuid as string,
					activityUuid: form?.uuidActivity,
					code: form?.code,
					contractorUuid: form?.contractorUuid,
					startDate: moment(form?.startDate).format('YYYY-MM-DD'),
					totalDayAdvantage: form?.totalDayAdvantage!,
					amount: price(form?.amount),
					contractExecutionAmount: price(form?.contractExecutionAmount),
					contractExecutionEndDate: form?.contractExecutionEndDate
						? moment(form?.contractExecutionEndDate).format('YYYY-MM-DD')
						: null,
					advanceGuaranteeAmount: price(form?.advanceGuaranteeAmount),
					advanceGuaranteeEndDate: form?.advanceGuaranteeEndDate
						? moment(form?.advanceGuaranteeEndDate).format('YYYY-MM-DD')
						: null,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				onClose();
				setForm({
					uuidActivity: '',
					nameActivity: '',
					code: '',
					contractorUuid: '',
					contractorGroupUuid: '',
					startDate: '',
					totalDayAdvantage: null,
					amount: 0,
					contractExecutionAmount: 0,
					contractExecutionEndDate: '',
					advanceGuaranteeAmount: 0,
					advanceGuaranteeEndDate: '',
				});
				queryClient.invalidateQueries([QUERY_KEY.detail_contract]);
				queryClient.invalidateQueries([QUERY_KEY.table_contract_fund_detail]);
			}
		},
	});

	const handleSubmit = () => {
		if (!form?.contractorUuid) {
			return toastWarn({msg: 'Chọn nhà thầu!'});
		}
		if (!form?.startDate) {
			return toastWarn({msg: 'Vui lòng chọn ngày ký hợp đồng!'});
		}

		return funcUpdateContract.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
			<Loading loading={funcUpdateContract.isLoading} />
			<div className={styles.container}>
				<h4 className={styles.title}>Chỉnh sửa hợp đồng</h4>
				<div className={styles.form}>
					<div className={styles.head}>
						<h4>Thông tin hợp đồng</h4>
					</div>
					<div className={styles.main_form}>
						<div className={clsx(styles.col_2)}>
							<Input
								label={
									<span>
										Tên công việc <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Nhập tên công việc '
								type='text'
								name='nameActivity'
								readOnly={true}
								value={form?.nameActivity}
							/>
							<div>
								<Input
									label={
										<span>
											Số hợp đồng <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder='Nhập số hợp đồng '
									type='text'
									name='code'
									value={form?.code}
									isRequired={true}
								/>
							</div>
						</div>

						<div className={clsx(styles.col_2, styles.mt)}>
							<Select
								isSearch
								name='contractorUuid'
								value={form.contractorUuid}
								placeholder='Lựa chọn'
								label={
									<span>
										Tên nhà thầu <span style={{color: 'red'}}>*</span>
									</span>
								}
							>
								{dropdownContractorInProject?.map((v: any) => (
									<Option
										key={v?.uuid}
										title={v?.name}
										value={v?.uuid}
										onClick={() =>
											setForm((prev) => ({
												...prev,
												contractorUuid: v?.uuid,
												contractorGroupUuid: v?.contractorCat?.uuid,
											}))
										}
									/>
								))}
							</Select>
							<div>
								<Select
									isSearch
									name='contractorGroupUuid'
									value={form.contractorGroupUuid}
									placeholder='Lựa chọn'
									readOnly={true}
									label={
										<span>
											Nhóm nhà thầu <span style={{color: 'red'}}>*</span>
										</span>
									}
								>
									{listGroupContractor?.map((v: any) => (
										<Option
											key={v?.uuid}
											title={v?.name}
											value={v?.uuid}
											onClick={() =>
												setForm((prev) => ({
													...prev,
													contractorGroupUuid: v?.uuid,
												}))
											}
										/>
									))}
								</Select>
							</div>
						</div>

						<div className={clsx(styles.col_2, styles.mt)}>
							<DatePicker
								onClean={true}
								icon={true}
								label={
									<span>
										Ngày ký hợp đồng <span style={{color: 'red'}}>*</span>
									</span>
								}
								name='startDate'
								value={form.startDate}
								placeholder='Chọn ngày ký hợp đồng'
								onSetValue={(date) =>
									setForm((prev) => ({
										...prev,
										startDate: date,
									}))
								}
							/>
							<Input
								label={
									<span>
										Thời gian thực hiện hợp đồng <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Nhập số ngày'
								type='number'
								name='totalDayAdvantage'
								value={form?.totalDayAdvantage}
								isRequired={true}
							/>
						</div>

						<div className={clsx(styles.mt)}>
							<Input
								label={
									<span>
										Giá trị hợp đồng <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Nhập giá trị hợp đồng '
								type='text'
								isMoney
								name='amount'
								value={form?.amount}
								unit='VND'
								isRequired={true}
							/>
						</div>
					</div>
					<div className={styles.head}>
						<h4>Thông tin bảo lãnh hợp đồng</h4>
					</div>
					<div className={styles.main_form}>
						<div className={clsx(styles.col_2)}>
							<Input
								label={<span>Giá trị bảo lãnh thực hiện hợp đồng</span>}
								placeholder='Nhập giá trị bảo lãnh thực hiện hợp đồng'
								type='text'
								isMoney
								name='contractExecutionAmount'
								value={form?.contractExecutionAmount}
								unit='VND'
							/>
							<DatePicker
								onClean={true}
								icon={true}
								label={<span>Ngày kết thúc bảo lãnh thực hiện hợp đồng</span>}
								name='contractExecutionEndDate'
								value={form.contractExecutionEndDate}
								placeholder='Chọn ngày'
								onSetValue={(date) =>
									setForm((prev) => ({
										...prev,
										contractExecutionEndDate: date,
									}))
								}
							/>
						</div>

						<div className={clsx(styles.col_2, styles.mt)}>
							<Input
								label={<span>Giá trị bảo lãnh tạm ứng</span>}
								placeholder='Nhập giá trị bảo lãnh tạm ứng'
								type='text'
								isMoney
								name='advanceGuaranteeAmount'
								value={form?.advanceGuaranteeAmount}
								unit='VND'
							/>
							<DatePicker
								onClean={true}
								icon={true}
								label={<span>Ngày kết thúc bảo lãnh tạm ứng</span>}
								name='advanceGuaranteeEndDate'
								value={form.advanceGuaranteeEndDate}
								placeholder='Chọn ngày'
								onSetValue={(date) =>
									setForm((prev) => ({
										...prev,
										advanceGuaranteeEndDate: date,
									}))
								}
							/>
						</div>
					</div>
				</div>

				<div className={styles.group_button}>
					<div>
						<Button p_12_20 grey rounded_6 onClick={onClose}>
							Hủy bỏ
						</Button>
					</div>
					<FormContext.Consumer>
						{({isDone}) => (
							<div className={styles.btn}>
								<Button disable={!isDone} p_12_20 primary rounded_6 icon={<FolderOpen size={18} color='#fff' />}>
									Cập nhật
								</Button>
							</div>
						)}
					</FormContext.Consumer>
				</div>
				<div className={styles.close} onClick={onClose}>
					<IoClose size={28} color='#8492A6' />
				</div>
			</div>
		</Form>
	);
}

export default FormUpdateContract;
