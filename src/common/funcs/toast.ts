import {toast} from 'react-toastify';
import IconCustom from './IconCustom/IconCustom';

export const toastText = ({msg}: {msg: string}) =>
	toast.info(msg, {
		position: 'top-center',
		autoClose: 2000,
		hideProgressBar: true,
		closeButton: false,
		className: 'toastify-custom',
		icon: IconCustom('info'),
	});

export const toastSuccess = ({msg}: {msg: string}) =>
	toast.success(msg, {
		autoClose: 2000,
		hideProgressBar: true,
		position: 'top-center',
		closeButton: true,
		className: 'toastify-custom-success',
		icon: IconCustom('success'),
	});

export const toastInfo = ({msg}: {msg: string}) =>
	toast.info(msg, {
		autoClose: 2000,
		hideProgressBar: true,
		position: 'top-center',
		closeButton: true,
		className: 'toastify-custom-info',
		icon: IconCustom('info'),
	});
export const toastWarn = ({msg}: {msg: string}) =>
	toast.warning(msg, {
		autoClose: 2000,
		hideProgressBar: true,
		position: 'top-center',
		closeButton: true,
		className: 'toastify-custom-warn',
		icon: IconCustom('warn'),
	});
export const toastError = ({msg}: {msg: string}) =>
	toast.error(msg, {
		autoClose: 2000,
		hideProgressBar: true,
		position: 'top-center',
		closeButton: true,
		className: 'toastify-custom-error',
		icon: IconCustom('error'),
	});
