import React, {useState} from 'react';

import {PropsUpdateInfoCapital} from './interfaces';
import styles from './UpdateInfoCapital.module.scss';
import {PATH} from '~/constants/config';
import LayoutPages from '~/components/layouts/LayoutPages';
import {useRouter} from 'next/router';
import Button from '~/components/common/Button';
import Breadcrumb from '~/components/common/Breadcrumb';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Form, {Input} from '~/components/common/Form';
import {convertCoin, price} from '~/common/funcs/convertCoin';
import clsx from 'clsx';
import Select, {Option} from '~/components/common/Select';
import {AddCircle, Trash} from 'iconsax-react';
import Loading from '~/components/common/Loading';
import GridColumn from '~/components/layouts/GridColumn';
import projectServices from '~/services/projectServices';
import {toastWarn} from '~/common/funcs/toast';

function UpdateInfoCapital({}: PropsUpdateInfoCapital) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuid} = router.query;

	const [form, setForm] = useState<{
		expectBudget: number | string;
		totalInvest: number | string;
		realBudget: number | string;
		reserveBudget: number | string;
		annual: {
			year: number | null;
			budget: number | string;
			annualNote: string;
		}[];
	}>({
		expectBudget: 0,
		realBudget: 0,
		reserveBudget: 0,
		totalInvest: 0,
		annual: [
			{
				year: new Date().getFullYear(),
				budget: 0,
				annualNote: '',
			},
		],
	});

	useQuery<any>([QUERY_KEY.detail_budget_project, _uuid], {
		queryFn: () =>
			httpRequest({
				http: projectServices.detailBudgetProject({
					uuid: _uuid as string,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					expectBudget: convertCoin(data?.expectBudget),
					realBudget: convertCoin(data?.realBudget),
					reserveBudget: convertCoin(data?.reserveBudget),
					totalInvest: convertCoin(data?.totalInvest),
					annual:
						data?.annual?.length == 0
							? [
									{
										year: new Date().getFullYear(),
										budget: 0,
										annualNote: '',
									},
							  ]
							: data?.annual?.map((v: any) => ({
									year: v?.year,
									budget: convertCoin(v?.budget),
									annualNote: v?.annualNote || '',
							  })),
				});
			}
		},
		enabled: !!_uuid,
	});

	const funcUpdateBudgetProject = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật vốn thành công!',
				http: projectServices.updateBudgetProject({
					uuid: _uuid as string,
					expectBudget: price(form?.expectBudget),
					realBudget: price(form?.realBudget),
					reserveBudget: price(form?.reserveBudget),
					totalInvest: price(form?.totalInvest),
					annual: form?.annual?.map((v) => ({
						year: v?.year!,
						budget: price(v?.budget),
						annualNote: v?.annualNote,
					})),
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.detail_budget_project]);
			}
		},
	});

	const updateBudgetProject = () => {
		if (form?.annual?.some((v) => price(v?.budget) == 0 || !v?.year)) {
			return toastWarn({msg: 'Nhập đầy đủ kế hoạch vốn theo năm!'});
		}

		return funcUpdateBudgetProject.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdateBudgetProject.isLoading} />
			<Breadcrumb
				listUrls={[
					{
						path: PATH.Project,
						title: 'Danh sách dự án',
					},
					{
						path: '',
						title: 'Chỉnh sửa dự án',
					},
				]}
			/>
			<LayoutPages
				listPages={[
					{
						title: 'Thông tin chung',
						path: `${PATH.UpdateInfoProject}?_uuid=${_uuid}`,
					},
					{
						title: 'Thông tin kế hoạch vốn',
						path: `${PATH.UpdateInfoCapital}?_uuid=${_uuid}`,
					},
					{
						title: 'Quản lý hợp đồng',
						path: `${PATH.UpdateDisbursementProgress}?_uuid=${_uuid}`,
					},
					{
						title: 'Quản lý nhà thầu',
						path: `${PATH.UpdateInfoContractor}?_uuid=${_uuid}`,
					},
				]}
				action={
					<div className={styles.group_btn}>
						<Button
							p_14_24
							rounded_8
							light-red
							onClick={(e) => {
								e.preventDefault();
								window.history.back();
							}}
						>
							Hủy bỏ
						</Button>
						<Button p_14_24 rounded_8 blueLinear onClick={updateBudgetProject}>
							Lưu lại
						</Button>
					</div>
				}
			>
				<div className={styles.main}>
					<Form form={form} setForm={setForm}>
						<div className={styles.basic_info}>
							<div className={styles.head}>
								<h4>Thông tin kế hoạch vốn</h4>
							</div>
							<div className={styles.form}>
								<GridColumn col_2>
									<Input
										label={
											<span>
												Kế hoạch vốn đầu tư <span style={{color: 'red'}}>*</span>
											</span>
										}
										unit='VNĐ'
										type='text'
										placeholder='Nhập kế hoạch vốn đầu tư'
										name='expectBudget'
										value={form?.expectBudget}
										isRequired={true}
										blur={true}
										isMoney={true}
									/>
									<div>
										<Input
											label={
												<span>
													Tổng mức đầu tư dự án <span style={{color: 'red'}}>*</span>
												</span>
											}
											unit='VNĐ'
											type='text'
											placeholder='Nhập tổng mức đầu tư dự án '
											name='totalInvest'
											value={form?.totalInvest}
											isRequired={true}
											blur={true}
											isMoney={true}
										/>
									</div>
									<Input
										label={<span>Tổng dự toán</span>}
										unit='VNĐ'
										type='text'
										placeholder='Nhập tổng dự toán'
										name='realBudget'
										value={form?.realBudget}
										isRequired={true}
										blur={true}
										isMoney={true}
									/>
									<div>
										<Input
											label={<span>Vốn dự phòng được duyệt</span>}
											unit='VNĐ'
											type='text'
											placeholder='Nhập vốn dự phòng được duyệt  '
											name='reserveBudget'
											value={form?.reserveBudget}
											blur={true}
											isMoney={true}
										/>
									</div>
								</GridColumn>
								<div className={clsx(styles.mt)}>
									<GridColumn col_2>
										<GridColumn col_2>
											<p className={styles.label}>
												Kế hoạch năm <span style={{color: 'red'}}>*</span>
											</p>
											<p className={styles.label}>
												Kế hoạch vốn theo năm <span style={{color: 'red'}}>*</span>
											</p>
										</GridColumn>
										<p className={styles.label}>Mục tiêu thực hiện trong năm</p>
									</GridColumn>
								</div>
								<div>
									{form?.annual?.map((v, i) => (
										<ItemAnnualToYear key={i} index={i} data={v} form={form} setForm={setForm} />
									))}
								</div>
								<div
									className={clsx(styles.mt, styles.btn_add)}
									onClick={() =>
										setForm((prev) => ({
											...prev,
											annual: [
												...prev.annual,
												{
													year: null,
													budget: 0,
													annualNote: '',
												},
											],
										}))
									}
								>
									<div>
										<AddCircle size={20} />
									</div>
									<p>Thêm kế hoạch năm</p>
								</div>
							</div>
						</div>
					</Form>
				</div>
			</LayoutPages>
		</div>
	);
}

export default UpdateInfoCapital;

const generateYearsArray = (): number[] => {
	const currentYear = new Date().getFullYear();
	const startYear = currentYear - 15;
	const endYear = currentYear + 15;

	const years = [];
	for (let year = startYear; year <= endYear; year++) {
		years.push(year);
	}
	return years;
};

function ItemAnnualToYear({
	index,
	data,
	form,
	setForm,
}: {
	index: number;
	data: {year: number | null; budget: number | string; annualNote: string};
	form: any;
	setForm: (any: any) => void;
}) {
	const years = generateYearsArray();

	const handleDelete = (index: number) => {
		setForm((prev: any) => ({
			...prev,
			annual: [...prev?.annual?.slice(0, index), ...prev?.annual?.slice(index + 1)],
		}));
	};

	const handleChangeValue = (index: number, name: string, value: any, isConvert?: boolean) => {
		const newData = [...form?.annual];

		if (isConvert) {
			if (!Number(price(value))) {
				newData[index] = {
					...newData[index],
					[name]: 0,
				};
			}

			newData[index] = {
				...newData[index],
				[name]: convertCoin(Number(price(value))),
			};
		} else {
			newData[index] = {
				...newData[index],
				[name]: value,
			};
		}

		setForm((prev: any) => ({
			...prev,
			annual: newData,
		}));
	};

	return (
		<div className={clsx(styles.item_annual_to_year)}>
			<GridColumn col_2>
				<GridColumn col_2>
					<Select isSearch={true} name='year' value={data.year} placeholder='Chọn'>
						{years?.map((v: any) => (
							<Option key={v} value={v} title={String(v)} onClick={() => handleChangeValue(index, 'year', v, false)} />
						))}
					</Select>
					<div className={styles.input_specification}>
						<input
							name='budget'
							value={data.budget}
							type='text'
							placeholder='Nhập thông số'
							className={styles.input}
							onChange={(e) => handleChangeValue(index, 'budget', e.target.value, true)}
						/>
						<div className={styles.unit}>VNĐ</div>
					</div>
				</GridColumn>
				<div className={styles.grid}>
					<div className={clsx(styles.input_specification, styles.textarea)}>
						<textarea
							name='annualNote'
							value={data.annualNote}
							placeholder='Nhập mô tả'
							className={styles.input}
							onChange={(e) => handleChangeValue(index, 'annualNote', e.target.value)}
						/>
					</div>
					{index != 0 && (
						<div className={styles.delete} onClick={() => handleDelete(index)}>
							<Trash size={24} color='#fff' />
						</div>
					)}
				</div>
			</GridColumn>
		</div>
	);
}
