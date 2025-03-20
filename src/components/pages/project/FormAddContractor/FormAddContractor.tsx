import React, {useState} from 'react';

import {IFormAddContractor, PropsFormAddContractor} from './interfaces';
import styles from './FormAddContractor.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import Select, {Option} from '~/components/common/Select';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import {FolderOpen} from 'iconsax-react';
import {QUERY_KEY, STATUS_CONFIG} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import DatePicker from '~/components/common/DatePicker';
import {useRouter} from 'next/router';
import {price} from '~/common/funcs/convertCoin';
import moment from 'moment';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import contractorcatServices from '~/services/contractorcatServices';
import contractorServices from '~/services/contractorServices';
import projectContractorServices from '~/services/projectContractorServices';

function FormAddContractor({onClose}: PropsFormAddContractor) {
	const queryClient = useQueryClient();
	const router = useRouter();

	const {_uuid} = router.query;

	const [form, setForm] = useState<IFormAddContractor>({
		type: '',
		contractorUuid: '',
		contractAmount: 0,
		contractEndDate: '',
		projectGuaranteeAmount: 0,
		projectGuaranteeEndDate: '',
		disbursementGuaranteeAmount: 0,
		disbursementGuaranteeEndDate: '',
	});

	const listGroupContractor = useQuery([QUERY_KEY.dropdown_group_contractor], {
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

	const {data: dropdownContractor} = useQuery([QUERY_KEY.dropdown_contractor, form.type], {
		queryFn: () =>
			httpRequest({
				http: contractorServices.categoryContractor({
					keyword: '',
					status: STATUS_CONFIG.ACTIVE,
					type: form.type!,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!form.type,
	});

	const funcAddContractorProject = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm nhà thầu vào dự án thành công!',
				http: projectContractorServices.addContractorWithGuaranteeProject({
					projectUuid: _uuid as string,
					contractorUuid: form?.contractorUuid,
					contractAmount: price(form.contractAmount),
					contractEndDate: form?.contractEndDate ? moment(form?.contractEndDate).format('YYYY-MM-DD') : null,
					projectGuaranteeAmount: price(form.projectGuaranteeAmount),
					projectGuaranteeEndDate: form?.projectGuaranteeEndDate
						? moment(form?.projectGuaranteeEndDate).format('YYYY-MM-DD')
						: null,
					disbursementGuaranteeAmount: price(form.disbursementGuaranteeAmount),
					disbursementGuaranteeEndDate: form?.disbursementGuaranteeEndDate
						? moment(form?.disbursementGuaranteeEndDate).format('YYYY-MM-DD')
						: null,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				onClose();
				setForm({
					type: '',
					contractorUuid: '',
					contractAmount: 0,
					contractEndDate: '',
					projectGuaranteeAmount: 0,
					projectGuaranteeEndDate: '',
					disbursementGuaranteeAmount: 0,
					disbursementGuaranteeEndDate: '',
				});
				queryClient.invalidateQueries([QUERY_KEY.table_list_contractor_project]);
			}
		},
	});

	const handleSubmit = () => {
		if (!form.contractorUuid) {
			return toastWarn({msg: 'Vui lòng chọn nhà thầu!'});
		}
		return funcAddContractorProject.mutate();
	};

	return (
		<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
			<Loading loading={funcAddContractorProject.isLoading} />
			<div className={styles.container}>
				<h4 className={styles.title}>Thêm mới nhà thầu vào dự án</h4>
				<div className={styles.form}>
					<Select
						isSearch
						name='type'
						value={form.type}
						placeholder='Lựa chọn'
						label={
							<span>
								Thuộc nhóm nhà thầu <span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						{listGroupContractor?.data?.map((v: any) => (
							<Option
								key={v?.id}
								title={v?.name}
								value={v?.id}
								onClick={() =>
									setForm((prev) => ({
										...prev,
										type: v?.id,
										contractorUuid: '',
									}))
								}
							/>
						))}
					</Select>
					<Select
						isSearch={true}
						name='contractorUuid'
						value={form?.contractorUuid}
						placeholder='Chọn'
						label={
							<span>
								Tên nhà thầu <span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						{dropdownContractor?.map((v: any) => (
							<Option
								key={v.uuid}
								value={v.uuid}
								title={v?.name}
								onClick={() =>
									setForm((prev) => ({
										...prev,
										contractorUuid: v?.uuid,
									}))
								}
							/>
						))}
					</Select>
					<div className={styles.mt}>
						<Input
							label={<span>Giá trị hợp đồng</span>}
							placeholder='Nhập giá trị hợp đồng '
							type='text'
							isMoney
							name='contractAmount'
							value={form?.contractAmount}
							unit='VND'
						/>
					</div>
					<div className={styles.mt}>
						<DatePicker
							onClean={true}
							icon={true}
							label={<span>Thời gian thực hiện hợp đồng</span>}
							name='contractEndDate'
							value={form.contractEndDate}
							placeholder='Chọn thời gian thực hiện hợp đồng'
							onSetValue={(date) =>
								setForm((prev) => ({
									...prev,
									contractEndDate: date,
								}))
							}
						/>
					</div>
					<div className={styles.mt}>
						<Input
							label={<span>Giá trị bảo lãnh thực hiện hợp đồng</span>}
							placeholder='Nhập giá trị bảo lãnh thực hiện hợp đồng'
							type='text'
							isMoney
							name='projectGuaranteeAmount'
							value={form?.projectGuaranteeAmount}
							unit='VND'
						/>
					</div>
					<div className={styles.mt}>
						<DatePicker
							onClean={true}
							icon={true}
							label={<span>Ngày kết thúc bảo lãnh thực hiện hợp đồng</span>}
							name='projectGuaranteeEndDate'
							value={form.projectGuaranteeEndDate}
							placeholder='Chọn ngày kết thúc bảo lãnh thực hiện hợp đồng'
							onSetValue={(date) =>
								setForm((prev) => ({
									...prev,
									projectGuaranteeEndDate: date,
								}))
							}
						/>
					</div>
					<div className={styles.mt}>
						<Input
							label={<span>Giá trị bảo lãnh tạm ứng </span>}
							placeholder='Nhập giá trị bảo lãnh tạm ứng'
							type='text'
							isMoney
							name='disbursementGuaranteeAmount'
							value={form?.disbursementGuaranteeAmount}
							unit='VND'
						/>
					</div>
					<div className={styles.mt}>
						<DatePicker
							onClean={true}
							icon={true}
							label={<span>Ngày kết thúc bảo lãnh tạm ứng</span>}
							name='disbursementGuaranteeEndDate'
							value={form.disbursementGuaranteeEndDate}
							placeholder='Chọn ngày kết thúc bảo lãnh tạm ứng'
							onSetValue={(date) =>
								setForm((prev) => ({
									...prev,
									disbursementGuaranteeEndDate: date,
								}))
							}
						/>
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

export default FormAddContractor;
