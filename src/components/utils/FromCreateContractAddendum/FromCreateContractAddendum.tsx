import React, {useEffect, useState} from 'react';

import {PropsFromCreateContractAddendum} from './interfaces';
import styles from './FromCreateContractAddendum.module.scss';
import Button from '~/components/common/Button';
import Form, {FormContext, Input} from '~/components/common/Form';
import {FolderOpen} from 'iconsax-react';
import {IoClose} from 'react-icons/io5';
import clsx from 'clsx';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_CONFIG} from '~/constants/config/enum';
import contractorServices from '~/services/contractorServices';
import {httpRequest} from '~/services';
import Select, {Option} from '~/components/common/Select';
import contractorcatServices from '~/services/contractorcatServices';
import DatePicker from '~/components/common/DatePicker';
import {toastWarn} from '~/common/funcs/toast';
import contractsServices from '~/services/contractsServices';
import moment from 'moment';
import {convertCoin, price} from '~/common/funcs/convertCoin';
import Loading from '~/components/common/Loading';
import GridColumn from '~/components/layouts/GridColumn';

function hasDuplicateContractor(
	data: {
		contractorUuid: string;
		contractorCatUuid: string;
		amountInContract: number | string;
	}[]
) {
	const seen = new Set();

	for (const item of data) {
		const key = `${item.contractorUuid}-${item.contractorCatUuid}`;
		if (seen.has(key)) {
			return true;
		}
		seen.add(key);
	}

	return false;
}

interface IFromCreateContractAddendum {
	codeParentContract: string;
	nameActivity: string;
	code: string;
	contractorAndCat: {
		contractorUuid: string;
		contractorCatUuid: string;
		amountInContract: number | string;
	}[];
	startDate: string;
	totalDayAdvantage: number | string;
	amount: number | string;
	contractExecutionAmount: number | string;
	contractExecutionEndDate: string;
	advanceGuaranteeAmount: number | string;
	advanceGuaranteeEndDate: string;
	contractParentUuid: string;
}

function FromCreateContractAddendum({onClose, uuidActivity, uuidContract, queryKeys}: PropsFromCreateContractAddendum) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<IFromCreateContractAddendum>({
		codeParentContract: '',
		nameActivity: '',
		code: '',
		contractorAndCat: [
			{
				contractorUuid: '',
				contractorCatUuid: '',
				amountInContract: 0,
			},
		],
		startDate: '',
		totalDayAdvantage: 0,
		amount: 0,
		contractExecutionAmount: 0,
		contractExecutionEndDate: '',
		advanceGuaranteeAmount: 0,
		advanceGuaranteeEndDate: '',
		contractParentUuid: '',
	});

	useQuery([QUERY_KEY.detail_contract_addium], {
		queryFn: () =>
			httpRequest({
				http: contractsServices.detailContractsAddium({
					uuid: uuidContract,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					codeParentContract: data?.parentContract?.code || '',
					nameActivity: data?.activity?.name || '',
					code: '',
					contractorAndCat:
						data?.contractor?.length == 0
							? [
									{
										contractorUuid: '',
										contractorCatUuid: '',
										amountInContract: 0,
									},
							  ]
							: data?.contractor?.map((v: any) => ({
									contractorUuid: v?.contractorDTO?.uuid || '',
									contractorCatUuid: v?.contractorDTO?.contractorCat?.[0]?.uuid || '',
									amountInContract: 0,
							  })),
					startDate: '',
					totalDayAdvantage: 0,
					amount: convertCoin(data?.amount),
					contractExecutionAmount: convertCoin(data?.contractExecution?.amount),
					contractExecutionEndDate: '',
					advanceGuaranteeAmount: convertCoin(data?.advanceGuarantee?.amount),
					advanceGuaranteeEndDate: '',
					contractParentUuid: data?.parentContract?.uuid || '',
				});
			}
		},
		enabled: !!uuidContract,
	});

	const funcCreateContractAdditional = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm mới phụ lục hợp đồng thành công!',
				http: contractsServices.insertAddendum({
					uuid: '',
					activityUuid: uuidActivity,
					code: form?.code,
					contractorAndCat: form?.contractorAndCat?.map((v) => ({
						contractorUuid: v?.contractorUuid,
						contractorCatUuid: v?.contractorCatUuid,
						amountInContract: price(v?.amountInContract),
					})),
					startDate: moment(form?.startDate).format('YYYY-MM-DD'),
					totalDayAdvantage: price(form?.totalDayAdvantage!),
					amount: price(form?.amount),
					contractExecutionAmount: price(form?.contractExecutionAmount),
					contractExecutionEndDate: form?.contractExecutionEndDate
						? moment(form?.contractExecutionEndDate).format('YYYY-MM-DD')
						: null,
					advanceGuaranteeAmount: price(form?.advanceGuaranteeAmount),
					advanceGuaranteeEndDate: form?.advanceGuaranteeEndDate
						? moment(form?.advanceGuaranteeEndDate).format('YYYY-MM-DD')
						: null,
					contractParentUuid: uuidContract,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				onClose();
				setForm({
					codeParentContract: '',
					nameActivity: '',
					code: '',
					contractorAndCat: [],
					startDate: '',
					totalDayAdvantage: 0,
					amount: 0,
					contractExecutionAmount: 0,
					contractExecutionEndDate: '',
					advanceGuaranteeAmount: 0,
					advanceGuaranteeEndDate: '',
					contractParentUuid: '',
				});
				queryKeys?.map((key) => queryClient.invalidateQueries([key]));
			}
		},
	});

	// Tính tổng tiển giá trị phụ lục hợp đồng qua tiền phụ lục hợp đồng theo từng nhà thầu
	useEffect(() => {
		const total = form?.contractorAndCat?.reduce((accumulator, currentValue) => accumulator + price(currentValue.amountInContract), 0);

		setForm((prev) => ({
			...prev,
			amount: convertCoin(total),
		}));
	}, [form?.contractorAndCat]);

	const handleSubmit = () => {
		if (!form?.startDate) {
			return toastWarn({msg: 'Vui lòng chọn ngày ký phụ lục hợp đồng!'});
		}
		if (form?.contractorAndCat?.length == 0) {
			return toastWarn({msg: 'Vui lòng thêm nhà thầu!'});
		}
		if (form?.contractorAndCat?.some((v) => !v?.contractorCatUuid || !v?.contractorUuid)) {
			return toastWarn({msg: 'Vui lòng chọn đầy đủ thông tin nhà thầu!'});
		}
		if (hasDuplicateContractor(form.contractorAndCat)) {
			return toastWarn({msg: 'Tên nhà thầu, nhóm nhà thầu trùng nhau!'});
		}

		return funcCreateContractAdditional.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
			<Loading loading={funcCreateContractAdditional.isLoading} />
			<div className={styles.container}>
				<h4 className={styles.title}>Thêm mới phụ lục hợp đồng</h4>
				<div className={styles.form}>
					<div className={styles.head}>
						<h4>Thông tin hợp đồng</h4>
					</div>
					<div className={styles.main_form}>
						<div>
							<Input
								label={
									<span>
										Hợp đồng chính <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Nhập hợp đồng chính '
								type='text'
								name='codeParentContract'
								readOnly={true}
								value={form?.codeParentContract}
							/>
						</div>
						<div className={clsx(styles.col_2, styles.mt)}>
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
											Số phụ lục hợp đồng <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder='Nhập số phụ lục hợp đồng '
									type='text'
									name='code'
									value={form?.code}
									isRequired={true}
								/>
							</div>
						</div>

						<div className={clsx(styles.col_2, styles.mt)}>
							<DatePicker
								onClean={true}
								icon={true}
								label={
									<span>
										Ngày ký phụ lục hợp đồng <span style={{color: 'red'}}>*</span>
									</span>
								}
								name='startDate'
								value={form.startDate}
								placeholder='Chọn ngày ký phụ lục hợp đồng'
								onSetValue={(date) =>
									setForm((prev) => ({
										...prev,
										startDate: date,
									}))
								}
							/>
							<Input
								label={<span>Thời gian gia hạn hợp đồng (ngày)</span>}
								placeholder='Nhập số ngày'
								type='text'
								name='totalDayAdvantage'
								value={form?.totalDayAdvantage}
								isMoney
								// isRequired={true}
							/>
						</div>

						<div className={clsx(styles.mt)}>
							<Input
								label={
									<span>
										Giá trị phụ lục hợp đồng <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Nhập giá trị phụ lục hợp đồng '
								type='text'
								isMoney
								name='amount'
								value={form?.amount}
								unit='VND'
								// isRequired={true}
								readOnly={true}
							/>
						</div>
					</div>

					<div className={styles.head}>
						<h4>Thông tin nhà thầu</h4>
					</div>
					<div className={styles.main_form}>
						<GridColumn col_3>
							<p className={styles.label}>
								Tên nhà thầu <span style={{color: 'red'}}>*</span>
							</p>
							<p className={styles.label}>
								Nhóm nhà thầu <span style={{color: 'red'}}>*</span>
							</p>
							<p className={styles.label}>Tiền phụ lục hợp đồng</p>
						</GridColumn>
						{form?.contractorAndCat?.map((v, i) => (
							<ItemContractorProject key={i} index={i} data={v} uuidActivity={uuidActivity} form={form} setForm={setForm} />
						))}
					</div>

					<div className={clsx(styles.head, styles.mt)}>
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
									Lưu lại
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

export default FromCreateContractAddendum;

function ItemContractorProject({
	index,
	uuidActivity,
	data,
	form,
	setForm,
}: {
	index: number;
	uuidActivity: string;
	data: {contractorUuid: string; contractorCatUuid: string; amountInContract: number | string};
	form: IFromCreateContractAddendum;
	setForm: (any: any) => void;
}) {
	const {data: dropdownContractorInProject} = useQuery([QUERY_KEY.dropdown_contractor_in_project], {
		queryFn: () =>
			httpRequest({
				http: contractorServices.categoryContractorInProject({
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
					uuid: uuidActivity,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!uuidActivity,
	});

	const {data: listGroupContractor} = useQuery([QUERY_KEY.dropdown_group_contractor, data?.contractorUuid], {
		queryFn: () =>
			httpRequest({
				http: contractorcatServices.categoryContractorCat({
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
					contractorUuid: data?.contractorUuid,
					activityUuid: uuidActivity,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!data?.contractorUuid && !!uuidActivity,
	});

	const handleChangeValue = (index: number, name: string, value: any, isConvert?: boolean) => {
		const newData = [...form.contractorAndCat];

		if (isConvert) {
			if (!Number(price(value))) {
				newData[index] = {
					...newData[index],
					[name]: 0,
					...(name === 'contractorUuid' ? {contractorCatUuid: ''} : {}),
				};
			}

			newData[index] = {
				...newData[index],
				[name]: convertCoin(Number(price(value))),
				...(name === 'contractorUuid' ? {contractorCatUuid: ''} : {}),
			};
		} else {
			newData[index] = {
				...newData[index],
				[name]: value,
				...(name === 'contractorUuid' ? {contractorCatUuid: ''} : {}),
			};
		}

		setForm((prev: any) => ({
			...prev,
			contractorAndCat: newData,
		}));
	};

	return (
		<div className={clsx(styles.contractorProject, styles.col_3)}>
			<Select isSearch={true} readOnly={true} name='contractorUuid' value={data?.contractorUuid} placeholder='Chọn'>
				{dropdownContractorInProject?.map((v: any) => (
					<Option key={v.uuid} value={v.uuid} title={v?.name} />
				))}
			</Select>
			<div>
				<Select isSearch={true} readOnly={true} name='contractorCatUuid' value={data?.contractorCatUuid} placeholder='Chọn'>
					{listGroupContractor?.map((v: any) => (
						<Option key={v.uuid} value={v.uuid} title={v?.name} />
					))}
				</Select>
			</div>
			<div className={styles.grid}>
				<div className={styles.input_specification}>
					<input
						name='value'
						type='text'
						placeholder='Nhập tiền phụ lục hợp đồng'
						className={styles.input}
						value={data?.amountInContract}
						onChange={(e) => handleChangeValue(index, 'amountInContract', e.target.value, true)}
					/>
					<div className={styles.unit}>VNĐ</div>
				</div>
			</div>
		</div>
	);
}
