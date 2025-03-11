import React, {useState} from 'react';
import {PropsFormExportExcel} from './interfaces';
import styles from './FormExportExcel.module.scss';
import {IoClose} from 'react-icons/io5';
import Select, {Option} from '~/components/common/Select';
import {useMutation, useQuery} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_CONFIG} from '~/constants/config/enum';
import projectServices from '~/services/projectServices';
import {httpRequest} from '~/services';
import {generateYearsArray} from '~/common/funcs/selectDate';
import Button from '~/components/common/Button';
import SelectMany from '~/components/common/SelectMany';
import overviewServices from '~/services/overviewServices';
import Loading from '~/components/common/Loading';

function FormExportExcel({onClose}: PropsFormExportExcel) {
	const today = new Date();

	const years = generateYearsArray();
	const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	const [projects, setProjects] = useState<any[]>([]);
	const [form, setForm] = useState<{
		year: number;
		month: number;
	}>({
		year: today.getFullYear(),
		month: today.getMonth() + 1,
	});

	// const {data: listProject} = useQuery([QUERY_KEY.dropdown_project], {
	// 	queryFn: () =>
	// 		httpRequest({
	// 			http: projectServices.categoryProject({
	// 				keyword: '',
	// 				status: STATUS_CONFIG.ACTIVE,
	// 			}),
	// 		}),
	// 	select(data) {
	// 		return data;
	// 	},
	// });

	const exportExcel = useMutation({
		mutationFn: () => {
			return httpRequest({
				http: overviewServices.exportOverviewReport({
					projectUuid: projects?.map((v: any) => v?.uuid),
					year: form.year,
					month: form.month,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				window.open(`${process.env.NEXT_PUBLIC_PATH_EXPORT}/${data}`, '_blank');
			}
		},
	});

	const handleExportExcel = () => {
		return exportExcel.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={exportExcel.isLoading} />
			<h4 className={styles.title}>Xuất danh sách nhân viên chưa báo cáo tháng</h4>
			<div className={styles.form}>
				<div className={styles.main_form}>
					{/* <div className={styles.mt}>
						<SelectMany
							placeholder='Tất cả công trình'
							label={<span>Chọn công trình</span>}
							value={projects}
							setValue={(prj) =>
								setProjects(
									projects?.find((v: any) => v?.uuid == prj.uuid)
										? projects?.filter((v: any) => v?.uuid != prj.uuid)
										: [...projects, prj]
								)
							}
							listData={listProject?.map((v: any) => ({
								uuid: v?.uuid,
								title: v?.name,
								code: v?.code,
							}))}
						/>
					</div> */}
					<div className={styles.mt}>
						<div className={styles.col_2}>
							<Select
								isSearch={true}
								label={
									<span>
										Năm <span style={{color: 'red'}}>*</span>
									</span>
								}
								name='year'
								value={form.year}
								placeholder='Chọn'
							>
								{years?.map((v: any) => (
									<Option
										key={v}
										value={v}
										title={`Năm ${v}`}
										onClick={() =>
											setForm((prev: any) => ({
												...prev,
												year: v,
											}))
										}
									/>
								))}
							</Select>
							<div>
								<Select
									isSearch={true}
									label={
										<span>
											Tháng <span style={{color: 'red'}}>*</span>
										</span>
									}
									name='month'
									value={form.month}
									placeholder='Chọn'
								>
									{months?.map((v: any) => (
										<Option
											key={v}
											value={v}
											title={`Tháng ${v}`}
											onClick={() =>
												setForm((prev: any) => ({
													...prev,
													month: v,
												}))
											}
										/>
									))}
								</Select>
							</div>
						</div>
					</div>
					<div className={styles.group_button}>
						<div>
							<Button p_12_20 white_outline rounded_6 onClick={onClose}>
								Hủy bỏ
							</Button>
						</div>
						<div className={styles.btn} onClick={handleExportExcel}>
							<Button p_12_20 primary rounded_6>
								Xác nhận
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.close} onClick={onClose}>
				<IoClose size={28} color='#9EA5C0' />
			</div>
		</div>
	);
}

export default FormExportExcel;
